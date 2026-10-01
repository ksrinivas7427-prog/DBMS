-- =============================================================================
-- CrowdConnect — Crowdfunding Platform for Social Causes
-- Complete Database Initialization Script for Review-3 (MySQL 8.0+)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS crowdconnect;
USE crowdconnect;

-- -----------------------------------------------------------------------------
-- 1. DROP EXISTING TABLES IN REVERSE DEPENDENCY ORDER
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS admin_reviews;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS users;

-- -----------------------------------------------------------------------------
-- 2. USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('DONOR', 'CREATOR', 'ADMIN') NOT NULL DEFAULT 'DONOR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. CAMPAIGNS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_target_amount CHECK (target_amount > 0),
    CONSTRAINT chk_raised_amount CHECK (raised_amount >= 0),
    CONSTRAINT fk_campaigns_creator FOREIGN KEY (creator_id) 
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. DONATIONS TABLE (MOCK PAYMENT TRACKING)
-- -----------------------------------------------------------------------------
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    campaign_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'SUCCESS',
    donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_donation_amount CHECK (amount > 0),
    CONSTRAINT fk_donations_donor FOREIGN KEY (donor_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_donations_campaign FOREIGN KEY (campaign_id) 
        REFERENCES campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. ADMIN REVIEWS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE admin_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    admin_id INT NOT NULL,
    decision ENUM('APPROVED', 'REJECTED') NOT NULL,
    remarks TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_campaign FOREIGN KEY (campaign_id) 
        REFERENCES campaigns(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_admin FOREIGN KEY (admin_id) 
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. PERFORMANCE INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_creator ON campaigns(creator_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_reviews_campaign ON admin_reviews(campaign_id);
CREATE INDEX idx_reviews_admin ON admin_reviews(admin_id);

-- -----------------------------------------------------------------------------
-- 7. SEED DEMO USERS
-- Passwords hashed using werkzeug pbkdf2:sha256 (compatible with Python backend)
-- Credentials:
-- Admin:   admin@crowdconnect.com   / Admin@123   (Role: ADMIN)
-- Creator: creator@crowdconnect.com / Creator@123 (Role: CREATOR)
-- Donor:   donor@crowdconnect.com   / Donor@123   (Role: DONOR)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'System Administrator', 'admin@crowdconnect.com', 'pbkdf2:sha256:1000000$qKNmasBP2shdbafa$37c2dd631a9c67bfac79e8e2761a84851cc75c6cbdf5a77b179224c8878abd1d', 'ADMIN'),
(2, 'Priya Sharma (Creator)', 'creator@crowdconnect.com', 'pbkdf2:sha256:1000000$QfK4NPVnKYGVEqdn$23e63d38f2be7ce058ffe38a8ba130d062c35fe4ce816a95f8eb56d1c2b02b63', 'CREATOR'),
(3, 'Rajesh Kumar (Donor)', 'donor@crowdconnect.com', 'pbkdf2:sha256:1000000$aTMGKbb1oUMKQOhX$9a5db5db3a7765b667f7576cf806f794b654d7276feabf95f38d41abe076b62c', 'DONOR');

-- -----------------------------------------------------------------------------
-- 8. SEED DEMO CAMPAIGNS
-- -----------------------------------------------------------------------------
INSERT INTO campaigns (id, creator_id, title, description, category, target_amount, raised_amount, status, image_url) VALUES
(1, 2, 'Clean Drinking Water for Rural Primary Schools', 
'Providing sustainable solar-powered water filtration units to 12 government primary schools in drought-prone districts, directly protecting over 2,400 school children from waterborne illnesses.', 
'Healthcare', 50000.00, 32500.00, 'APPROVED', 
'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'),

(2, 2, 'Pediatric Cardiac Surgery Relief Fund', 
'Sponsoring critical open-heart surgeries and post-operative ICU care for underprivileged infants and children diagnosed with congenital heart disease whose families cannot afford private hospital charges.', 
'Healthcare', 120000.00, 84000.00, 'APPROVED', 
'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'),

(3, 2, 'Solar Digital Classrooms for Remote Tribal Communities', 
'Installing off-grid solar kits, interactive tablets, and vernacular educational content in remote hill communities to bridge the acute digital divide for primary students.', 
'Education', 45000.00, 18000.00, 'APPROVED', 
'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'),

(4, 2, 'Emergency Flood Disaster Relief & Food Packs', 
'Deploying immediate relief rations, hygiene supplies, dry clothes, and water purification tablets to 500 flood-affected families currently relocated to relief camps.', 
'Disaster Relief', 60000.00, 0.00, 'PENDING', 
'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80'),

(5, 2, 'Commercial Retail Store Expansion Project', 
'Campaign requested funding for private commercial business equipment and personal office interior improvements without community benefit.', 
'Business', 35000.00, 0.00, 'REJECTED', 
'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80');

-- -----------------------------------------------------------------------------
-- 9. SEED DEMO DONATIONS (REAL ENTRIES LINKED TO MySQL USERS & CAMPAIGNS)
-- -----------------------------------------------------------------------------
INSERT INTO donations (id, donor_id, campaign_id, amount, payment_status, donated_at) VALUES
(1, 3, 1, 15000.00, 'SUCCESS', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 3, 1, 17500.00, 'SUCCESS', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 3, 2, 50000.00, 'SUCCESS', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 3, 2, 34000.00, 'SUCCESS', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 3, 3, 18000.00, 'SUCCESS', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- -----------------------------------------------------------------------------
-- 10. SEED ADMIN REVIEWS
-- -----------------------------------------------------------------------------
INSERT INTO admin_reviews (campaign_id, admin_id, decision, remarks, reviewed_at) VALUES
(1, 1, 'APPROVED', 'Verified nonprofit registration, district educational board permission, and vendor quotation for solar filtration units.', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 1, 'APPROVED', 'Reviewed hospital estimation letters and physician diagnosis certificates. Cause meets critical emergency standards.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 1, 'APPROVED', 'Curriculum alignment and village council NOC verified. Excellent initiative for rural literacy.', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 1, 'REJECTED', 'Campaign does not qualify as a social cause under CrowdConnect charter. Personal and commercial venture funding is prohibited.', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Reset auto-increment pointers to next free IDs
ALTER TABLE users AUTO_INCREMENT = 10;
ALTER TABLE campaigns AUTO_INCREMENT = 10;
ALTER TABLE donations AUTO_INCREMENT = 10;
ALTER TABLE admin_reviews AUTO_INCREMENT = 10;
