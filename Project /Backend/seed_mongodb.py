"""
Seed Initial Flexible Campaign Content into MongoDB
Database: crowdconnect
Collection: campaign_contents

Logically links with existing MySQL campaign IDs (1, 2, 3) without duplicating
relational transactional data (titles, targets, raised amounts, passwords, etc.).
"""

from datetime import datetime, timezone
from app.mongodb import get_campaign_contents_collection, init_mongo_indexes

def seed_mongodb():
    init_mongo_indexes()
    collection = get_campaign_contents_collection()

    demo_contents = [
        {
            "campaign_id": 1,
            "story": (
                "In 12 rural government primary schools across the Kanchipuram and Vellore districts, "
                "over 2,400 students currently rely on unfiltered borewell water with dangerous total dissolved "
                "solids (TDS) exceeding 1,450 ppm and seasonal microbial contaminants.\n\n"
                "This initiative installs commercial-grade, multi-stage solar-powered Reverse Osmosis (RO) filtration "
                "kiosks with UV sterilizers that operate completely off-grid. Each unit dispenses up to 500 liters "
                "of certified clean drinking water daily, drastically eliminating absenteeism caused by waterborne "
                "typhoid and acute dysentery."
            ),
            "cause_details": {
                "problem": "Severe groundwater mineral contamination and seasonal waterborne illnesses causing student absenteeism.",
                "beneficiaries": 2400,
                "location": "Kanchipuram & Vellore Rural Districts, Tamil Nadu",
                "project_duration": "6 Months",
                "water_standard": "WHO Safe Drinking Water Standards (TDS < 150 ppm)"
            },
            "beneficiary_details": {
                "name": "Rural Primary School Education & Health Alliance",
                "location": "Tamil Nadu, India",
                "number_of_beneficiaries": 2400,
                "description": "A consortium of 12 village headmasters and local parent-teacher associations safeguarding rural school hygiene."
            },
            "updates": [
                {
                    "title": "Vendor Procurement & Site Inspection Completed",
                    "content": "Site water quality tests were executed at all 12 schools. Vendor contracts finalized for heavy-duty solar PV modules and high-flux RO membranes.",
                    "created_at": "2026-09-18T10:00:00Z"
                },
                {
                    "title": "First 4 RO Filtration Units Installed",
                    "content": "Thanks to donor contributions, installation has concluded at Walajapet and Nemili primary schools. Tested water showed zero coliform and TDS of 110 ppm!",
                    "created_at": "2026-09-25T14:30:00Z"
                }
            ],
            "media": [
                {
                    "type": "image",
                    "url": "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
                    "caption": "Students testing the newly installed solar drinking water station"
                },
                {
                    "type": "image",
                    "url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
                    "caption": "School assembly after water filtration demonstration"
                }
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "campaign_id": 2,
            "story": (
                "Congenital heart disease affects 8 out of every 1,000 newborns in India. For underprivileged families "
                "subsisting on daily agricultural wages, surgical correction costs at private hospitals represent an insurmountable barrier.\n\n"
                "The Pediatric Cardiac Surgery Relief Fund covers direct operation theater charges, prosthetic patches, "
                "pediatric ICU ventilation, and 6 months of mandatory post-operative cardiac medicines for 18 critically ill infants. "
                "Every rupee is audited directly against Apollo Pediatric Hospital case file numbers."
            ),
            "cause_details": {
                "problem": "Congenital Ventricular Septal Defects (VSD) and Tetralogy of Fallot requiring urgent open-heart surgery.",
                "beneficiaries": 18,
                "location": "Apollo Pediatric Heart Ward, Hyderabad, Telangana",
                "average_cost_per_surgery": 85000,
                "icu_support_days": 5
            },
            "beneficiary_details": {
                "name": "Little Hearts Child Health Foundation",
                "location": "Hyderabad, Telangana",
                "number_of_beneficiaries": 18,
                "description": "Non-profit charity working with pediatric cardiothoracic surgeons to provide free corrective surgery to low-income children."
            },
            "updates": [
                {
                    "title": "Successful Open-Heart Surgery for Baby Aarav",
                    "content": "Baby Aarav (8 months old) underwent a complex 4-hour VSD patch repair surgery. He has been transferred from pediatric ICU to the general ward with normal oxygen saturation.",
                    "created_at": "2026-09-22T08:15:00Z"
                },
                {
                    "title": "Pre-Op Screening for Next 3 Child Candidates",
                    "content": "Echo examinations completed for 3 children from Warangal district. Surgeries scheduled for the coming week as target funds approach.",
                    "created_at": "2026-09-28T16:00:00Z"
                }
            ],
            "media": [
                {
                    "type": "image",
                    "url": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
                    "caption": "Pediatric cardiothoracic surgeon reviewing echocardiogram"
                }
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "campaign_id": 3,
            "story": (
                "Deep in the eastern ghats of Araku Valley, over 350 indigenous tribal students have zero access to the internet, "
                "reliable electricity, or current educational materials. Government schools in these hamlets rely on single-room shelters.\n\n"
                "This initiative establishes off-grid solar digital classrooms. We supply 50 ruggedized tablets pre-loaded with vernacular "
                "(Telugu & English) STEM software, animated math lessons, and offline encyclopedias, accompanied by 2kW rooftop solar battery packs."
            ),
            "cause_details": {
                "problem": "Complete lack of grid electricity and acute digital learning divide for indigenous tribal children.",
                "beneficiaries": 350,
                "location": "Araku Valley Tribal Hamlets, Alluri Sitharama Raju District, Andhra Pradesh",
                "tablets_supplied": 50,
                "solar_capacity_kw": 2.0
            },
            "beneficiary_details": {
                "name": "Giri Vikas Tribal Literacy Trust",
                "location": "Araku Valley, Andhra Pradesh",
                "number_of_beneficiaries": 350,
                "description": "Grassroots community network dedicated to mother-tongue and digital education in remote tribal habitations."
            },
            "updates": [
                {
                    "title": "Solar Photovoltaic Kits Delivered to Base Camp",
                    "content": "Batteries, solar panels, and 50 educational tablets arrived at Araku valley coordination hub for testing and firmware flashing.",
                    "created_at": "2026-09-24T12:00:00Z"
                }
            ],
            "media": [
                {
                    "type": "image",
                    "url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
                    "caption": "Students practicing math modules on vernacular digital tablets"
                }
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]

    for item in demo_contents:
        camp_id = item["campaign_id"]
        collection.update_one(
            {"campaign_id": camp_id},
            {"$set": item},
            upsert=True
        )
        print(f"Upserted MongoDB content for MySQL Campaign ID: {camp_id}")

    count = collection.count_documents({})
    print(f"\n[MongoDB Seed Complete] Total documents in 'campaign_contents': {count}")

if __name__ == '__main__':
    seed_mongodb()
