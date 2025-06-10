-- Users Table (Parent Table for All Roles)

-- Role Table (For Managing User Roles)
CREATE TABLE roles (
    id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- (Employee, Employer, Agency, Admin)
);

-- permissions Table (For Managing User Permissions)
CREATE TABLE permissions (
    id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- (e.g., 'view_users', 'edit_users', etc.)    
);

-- Role-Permission Association Table
CREATE TABLE role_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id TINYINT UNSIGNED NOT NULL, -- Reference to Roles table
    permission_id TINYINT UNSIGNED NOT NULL, -- Reference to Permissions table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(255) NULL,
    title VARCHAR(255) NOT NULL,  -- Category or service name
    description TEXT NULL, -- Brief description
    no_of_listings INT UNSIGNED DEFAULT 0, -- Tracks the number of active listings
    parent_id BIGINT UNSIGNED NULL, -- Reference to the same table for sub-categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assign Default Roles (Run this after table creation)
INSERT INTO roles (id, name) VALUES 
(1, 'Employee'), 
(2, 'Employer'), 
(3, 'Agency'), 
(4, 'Admin');

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_image VARCHAR(255) NULL,
    role_id TINYINT UNSIGNED NOT NULL,  -- (1 = Employee, 2 = Employer, 3 = Agency, 4 = Admin)
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified_at TIMESTAMP NULL,  -- Laravel email verification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees Table (Only for Role: Employee)
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),

    -- Basic Info
    gender VARCHAR(10),
    date_of_birth DATE,
    age INT,
    nationality VARCHAR(100),
    passport_copy TEXT,
    visa_copy TEXT,
    cpr_copy TEXT,
    current_location VARCHAR(100),
    in_bahrain BOOLEAN,
    outside_country VARCHAR(100),
    work_available ENUM('Immediately', 'After Days'),
    no_of_days_available VARCHAR(50),

    -- Contact Details
    whatsapp_number VARCHAR(20),

    -- Employment Details
    expected_salary DECIMAL(10,2),
    notice_period VARCHAR(50),
    need_air_ticket BOOLEAN,
    other_benefits TEXT,

    -- Category & Type
    employee_category ENUM('Driver', 'Cook', 'Maid', 'Nanny', 'Elderly Care'),
    employee_type ENUM('Independent', 'Agency Managed'),

    -- Additional Info
    religion VARCHAR(50),
    marital_status VARCHAR(50),
    number_of_children TINYINT,
    education_level VARCHAR(100),
    facebook_profile TEXT,
    visa_status ENUM('Own Visa', 'Needs Sponsorship'),
    visa_expiry_date DATE,
    interview_mode ENUM('In-person', 'Phone', 'Video Call'),
    willing_to_livein ENUM('Yes', 'No', 'Conditional'),
    relocation_flexibility BOOLEAN,
    max_work_hours_per_day TINYINT,
    flexible_weekends BOOLEAN,
    preferred_household_type ENUM('Local', 'Expat', 'No Preference'),
    preferred_language_for_communication VARCHAR(50),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Job Listing Preferences Table
CREATE TABLE employee_job_preferences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- Reference to Employees table
    preferred_job_type ENUM('Remote', 'Contract', 'Full-time', 'Part-time') NOT NULL,
    preferred_location VARCHAR(255) NULL,
    minimum_salary DECIMAL(10, 2) DEFAULT 0.00,
    maximum_salary DECIMAL(10, 2) DEFAULT 0.00,
    availability ENUM('Available', 'Not Available') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Employee Rates Table (For storing different rates for employees)
CREATE TABLE employee_rates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- Reference to Employees table
    rate_type ENUM('Hourly', 'Monthly') NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Employee Categories Table (For storing multiple categories an employee is expert in)
CREATE TABLE employee_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- Reference to Employees table
    category_id BIGINT UNSIGNED NOT NULL, -- Reference to Categories table
    skill_level ENUM('Beginner', 'Intermediate', 'Expert') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Employee Work Experiences Table
CREATE TABLE employee_work_experiences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- Reference to Employees table
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL, -- NULL if currently working
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Work Experience
CREATE TABLE employee_experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    employer_name VARCHAR(255),
    employment_location VARCHAR(255),
    employer_contact VARCHAR(255),
    start_date DATE,
    end_date DATE,
    designation VARCHAR(100),
    employment_details TEXT,
    salary DECIMAL(10,2),
    benefits TEXT,
    rating TINYINT,
    review TEXT,
    country VARCHAR(100),
    resend_review_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Documents
CREATE TABLE employee_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    file_type ENUM('Visa', 'CPR', 'Passport', 'Certificate', 'License', 'Reference', 'Work Photo'),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Languages
CREATE TABLE employee_languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    language VARCHAR(50),
    proficiency TINYINT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Pets Experience
CREATE TABLE employee_pets_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    has_experience BOOLEAN,
    details TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Skills
CREATE TABLE employee_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    skill_name VARCHAR(100),
    skill_category ENUM('Cooking', 'Cleaning', 'Laundry', 'Babysitting', 'Elderly Care', 'Pet Care', 'Driving'),
    rating TINYINT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Education
CREATE TABLE employee_education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    education_level VARCHAR(100),
    details TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Employment Preferences
CREATE TABLE employee_employment_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    preference ENUM('Live-In', 'Live-Out', 'Full-Time', 'Part-Time', 'Monthly', 'Temporary', 'Nanny (Newborns)'),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Contract History
CREATE TABLE employee_contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    contract_start DATE,
    contract_end DATE,
    last_salary DECIMAL(10,2),
    duration VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Employers Table (Only for Role: Employer)
CREATE TABLE employers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE, -- Reference to Users table
    company_name VARCHAR(255) NULL,
    contact_number VARCHAR(50) NULL,
    address TEXT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    profile_verification_status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Agencies Table (Only for Role: Agency)
CREATE TABLE agencies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    
    -- Basic Info
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255), -- URL or file path to logo
    company_name VARCHAR(100) NOT NULL,
    office_address TEXT,
    country VARCHAR(100),

    -- Contact Info
    phone_number VARCHAR(20),
    email_address VARCHAR(100),

    -- Legal & Compliance Info
    trade_license_number VARCHAR(100),
    license_expiry_date DATE,
    trade_license_pdf VARCHAR(255), -- File path or URL to uploaded PDF
    years_in_operation INT UNSIGNED,
    registered_legal_name VARCHAR(100),
    agency_type ENUM('Local', 'International', 'Referral Only', 'Full-Service'),

    -- Service Offering Details
    services_provided JSON, -- e.g., ["Recruitment", "Visa Sponsorship"]
    countries_of_operation JSON,
    languages_spoken JSON,
    employee_nationalities JSON,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Interview Requests Table
CREATE TABLE interview_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    employer_id INT,
    requested_date DATETIME,
    status ENUM('Pending', 'Accepted', 'Rejected'),
    scheduled_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Interview Request History Table
CREATE TABLE interview_request_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    interview_request_id BIGINT UNSIGNED NOT NULL, -- Reference to Interview Requests table
    status ENUM('Pending', 'Accepted', 'Declined', 'Rescheduled', 'Cancelled') NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    FOREIGN KEY (interview_request_id) REFERENCES interview_requests(id) ON DELETE CASCADE
);

-- Document Uploads Table (For Employees & Agencies)
CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL, -- Can be employee, agency, or even employer
    document_type ENUM('Visa', 'Certificate', 'Reference', 'Registration') NOT NULL,
    file_path VARCHAR(255) NOT NULL, -- Storage path to the document
    verification_status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE website_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,  -- Unique identifier (e.g., "site_title")
    setting_value TEXT NOT NULL, -- Stores text, JSON, or links
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings (Run this once after table creation)
INSERT INTO website_settings (setting_key, setting_value) VALUES
('site_title', 'My Dynamic Website'),
('meta_description', 'Best platform to connect employees and employers.'),
('footer_text', '© 2025 All rights reserved.'),
('contact_email', 'support@mywebsite.com'),
('contact_phone', '+1 234 567 890'),
('facebook_link', 'https://facebook.com/mywebsite'),
('twitter_link', 'https://twitter.com/mywebsite'),
('linkedin_link', 'https://linkedin.com/company/mywebsite'),
('about_us', 'Welcome to our website. We connect people and businesses efficiently.'),
('privacy_policy', 'Your data privacy is our priority.'),
('terms_conditions', 'By using this site, you agree to our terms.');

CREATE TABLE listings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL, -- Reference to Categories table
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    price_type ENUM('Per Hour', 'Monthly') NOT NULL,
    listing_type ENUM('Remote', 'Contract', 'Full-time', 'Part-time') NOT NULL,
    location VARCHAR(255) NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT UNSIGNED NOT NULL, -- Reference to Listings table
    user_id BIGINT UNSIGNED NOT NULL, -- Reference to Users table
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL, -- Reference to Bookings table
    rating TINYINT UNSIGNED NOT NULL, -- 1 to 5
    review_text TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE agency_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agency_id BIGINT UNSIGNED NOT NULL, -- Reference to Agencies table
    employee_id BIGINT UNSIGNED NOT NULL, -- Reference to Employees table
    rating TINYINT UNSIGNED NOT NULL, -- 1 to 5
    review_text TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Reviews / Ratings
CREATE TABLE employer_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    experience_id INT,
    reviewer_email VARCHAR(255),
    rating TINYINT,
    review TEXT,
    token VARCHAR(255),
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES employee_experiences(id)
);

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL, -- Reference to Users table
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT UNSIGNED NOT NULL, -- Reference to Users table
    receiver_id BIGINT UNSIGNED NOT NULL, -- Reference to Users table
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE hires (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employer_id BIGINT UNSIGNED NOT NULL, -- Reference to Employers table
    employee_id BIGINT UNSIGNED NOT NULL, -- Reference to Employees table
    hire_date DATE NOT NULL,
    status ENUM('Active', 'Terminated') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Employee Agency Association Table
CREATE TABLE employee_agency_associations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- Reference to Employees table
    agency_id BIGINT UNSIGNED NOT NULL, -- Reference to Agencies table
    association_date DATE NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

CREATE TABLE contact_us_queries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE faqs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE terms (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Countries Table
CREATE TABLE countries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- Country name
    dail_code VARCHAR(10) NOT NULL, -- Dialing code
    currency VARCHAR(10) NOT NULL, -- Currency code (e.g., USD, EUR)
    iso_code VARCHAR(3) NOT NULL UNIQUE, -- ISO 3166-1 alpha-3 code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- States Table
CREATE TABLE states (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    country_id BIGINT UNSIGNED NOT NULL, -- Reference to Countries table
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);

-- Cities Table
CREATE TABLE cities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    state_id BIGINT UNSIGNED NOT NULL, -- Reference to States table
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);











