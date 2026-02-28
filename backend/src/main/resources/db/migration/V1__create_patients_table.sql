CREATE TABLE patients (
    id         BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100)  NOT NULL,
    last_name  VARCHAR(100)  NOT NULL,
    date_of_birth DATE       NOT NULL,
    gender     VARCHAR(20),
    phone      VARCHAR(20),
    email      VARCHAR(100),
    address    VARCHAR(255),
    created_at TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP     NOT NULL DEFAULT NOW()
);
