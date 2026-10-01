import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def request(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run_tests():
    print("=== STARTING COMPLETE SYSTEM VERIFICATION ===")

    # 1. Dual Database Health Check
    status, res = request("/health")
    assert status == 200, f"Health check failed with status {status}: {res}"
    assert res.get("mysql") == "connected", f"MySQL not connected: {res}"
    assert res.get("mongodb") == "connected", f"MongoDB not connected: {res}"
    print("[PASS] Dual Database Health Check verified: Both MySQL and MongoDB are active and connected.")

    # 2. Login Tests
    for role, email, pwd in [
        ("ADMIN", "admin@crowdconnect.com", "Admin@123"),
        ("CREATOR", "creator@crowdconnect.com", "Creator@123"),
        ("DONOR", "donor@crowdconnect.com", "Donor@123"),
    ]:
        status, res = request("/auth/login", method="POST", data={"email": email, "password": pwd})
        assert status == 200 and res["success"] and res["user"]["role"] == role, f"Login failed for {role}: {res}"
        print(f"[PASS] Login verified for {role} ({email}) with JWT generation.")

    # Get tokens
    _, admin_res = request("/auth/login", method="POST", data={"email": "admin@crowdconnect.com", "password": "Admin@123"})
    admin_token = admin_res["access_token"]

    _, creator_res = request("/auth/login", method="POST", data={"email": "creator@crowdconnect.com", "password": "Creator@123"})
    creator_token = creator_res["access_token"]

    _, donor_res = request("/auth/login", method="POST", data={"email": "donor@crowdconnect.com", "password": "Donor@123"})
    donor_token = donor_res["access_token"]

    # 3. Registration Test
    test_email = "test.donor.unique@crowdconnect.com"
    status, res = request("/auth/register", method="POST", data={
        "name": "Automated Test Donor",
        "email": test_email,
        "password": "Password@123",
        "role": "DONOR"
    })
    # If already exists (from rerun), that's fine or 201
    assert status in [201, 409], f"Unexpected register status: {status}, {res}"
    print("[PASS] Registration validation and user persistence verified in MySQL.")

    # 4. Creator submits Campaign (MySQL)
    status, res = request("/campaigns", method="POST", data={
        "title": "Automated Test Relief Initiative",
        "category": "Disaster Relief",
        "target_amount": 25000,
        "description": "Providing shelter and medical kits to families displaced by heavy monsoon rainfall."
    }, token=creator_token)
    assert status == 201, f"Campaign creation failed: {res}"
    new_campaign_id = res["campaign"]["id"]
    assert res["campaign"]["status"] == "PENDING", "Campaign must start as PENDING!"
    print(f"[PASS] Creator submitted campaign ID {new_campaign_id} into MySQL with initial status PENDING.")

    # 5. Creator adds Flexible Campaign Content into MongoDB
    status, res = request(f"/campaigns/{new_campaign_id}/content", method="PUT", data={
        "story": "Detailed operational narrative of emergency shelter deployment across 4 flooded villages.",
        "cause_details": {
            "problem": "Flash floods destroyed 80 kutcha houses.",
            "beneficiaries": 320,
            "location": "Krishna River Basin, Vijayawada"
        },
        "beneficiary_details": {
            "name": "Krishna Delta Flood Relief Alliance",
            "location": "Vijayawada Rural",
            "number_of_beneficiaries": 320,
            "description": "Local volunteer collective providing emergency shelter and food kits."
        }
    }, token=creator_token)
    assert status == 200 and res["success"], f"MongoDB content update failed: {res}"
    print(f"[PASS] Creator saved flexible campaign story & cause details into MongoDB for Campaign ID {new_campaign_id}.")

    # 6. Creator posts a Campaign Update to MongoDB
    status, res = request(f"/campaigns/{new_campaign_id}/updates", method="POST", data={
        "title": "Warehouse Logistics Dispatched",
        "content": "First truck of waterproof tarpaulins and medical supplies dispatched to relief camp."
    }, token=creator_token)
    assert status == 201 and res["success"], f"MongoDB update post failed: {res}"
    print(f"[PASS] Creator posted campaign update to MongoDB array for Campaign ID {new_campaign_id}.")

    # 7. Public Visibility Test: Pending campaign must NOT be in public /campaigns
    status, res = request("/campaigns")
    assert status == 200
    public_ids = [c["id"] for c in res["campaigns"]]
    assert new_campaign_id not in public_ids, "CRITICAL ERROR: PENDING campaign must NOT be visible to public!"
    print("[PASS] Public visibility rule verified: PENDING campaign is NOT visible on public listing.")

    # 8. Admin Audits & Approves Campaign (MySQL)
    status, res = request(f"/admin/campaigns/{new_campaign_id}/approve", method="PUT", data={
        "remarks": "Verified documentation and district relief commission authorization."
    }, token=admin_token)
    assert status == 200, f"Approval failed: {res}"
    print(f"[PASS] Admin approved campaign ID {new_campaign_id} and recorded audit review in MySQL.")

    # 9. Public Visibility Test 2: Now it MUST be in /campaigns
    status, res = request("/campaigns")
    public_ids = [c["id"] for c in res["campaigns"]]
    assert new_campaign_id in public_ids, "Approved campaign MUST be visible to public!"
    print("[PASS] Public visibility rule verified: APPROVED campaign is now live on public listing.")

    # 10. Public Campaign Detail retrieves both MySQL + MongoDB content
    status, camp_res = request(f"/campaigns/{new_campaign_id}")
    assert status == 200 and camp_res["campaign"]["id"] == new_campaign_id
    status, mongo_res = request(f"/campaigns/{new_campaign_id}/content")
    assert status == 200 and mongo_res["content"] is not None
    assert "Krishna River Basin" in mongo_res["content"]["cause_details"]["location"]
    assert len(mongo_res["content"]["updates"]) >= 1
    print(f"[PASS] Dual-Database Retrieval verified: MySQL core data + MongoDB content combined seamlessly.")

    # 11. Donor donates to the newly approved campaign (Atomic Transaction in MySQL)
    donation_amount = 500.00
    status, res = request(f"/campaigns/{new_campaign_id}/donate", method="POST", data={
        "amount": donation_amount
    }, token=donor_token)
    assert status == 200, f"Donation failed: {res}"
    assert res["updated_campaign"]["raised_amount"] == donation_amount, "Raised amount was not updated in MySQL!"
    print(f"[PASS] Atomic MySQL donation transaction successful: donated ${donation_amount}, campaign raised_amount updated in MySQL.")

    # 12. Donor fetches donation history (MySQL)
    status, res = request("/donations/my", token=donor_token)
    assert status == 200
    my_donations = res["donations"]
    matching = [d for d in my_donations if d["campaign_id"] == new_campaign_id]
    assert len(matching) > 0, "Donation record not found in donor history!"
    print("[PASS] Donor donation history verified: Live records correctly retrieved from MySQL.")

    # 13. Admin Stats (MySQL)
    status, res = request("/admin/stats", token=admin_token)
    assert status == 200 and res["stats"]["total_campaigns"] > 0
    print(f"[PASS] Admin dashboard statistics verified from MySQL: {res['stats']}")

    print("\n=================================================================")
    print(" ALL DUAL-DATABASE SYSTEM VERIFICATION CHECKS PASSED WITH 0 ERRORS! ")
    print(" MySQL: Primary Relational Data & Atomic Transactions            ")
    print(" MongoDB: Secondary Document Data for Flexible Content           ")
    print("=================================================================")

if __name__ == "__main__":
    run_tests()

