CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    title VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Doctors
INSERT INTO users (first_name, last_name, role, title, email) VALUES
('Sarah', 'Roberts', 'DOCTOR', 'MD', 'sarah.roberts@clinic.com'),
('David', 'Kim', 'DOCTOR', 'DO', 'david.kim@clinic.com');

-- Nurses
INSERT INTO users (first_name, last_name, role, title, email) VALUES
('Maria', 'Santos', 'NURSE', 'RN', 'maria.santos@clinic.com'),
('James', 'Okafor', 'NURSE', 'RN', 'james.okafor@clinic.com');

-- Office Workers
INSERT INTO users (first_name, last_name, role, title, email) VALUES
('Linda', 'Park', 'OFFICE', NULL, 'linda.park@clinic.com'),
('Kevin', 'Brooks', 'OFFICE', NULL, 'kevin.brooks@clinic.com');
