CREATE TABLE patient_allergies (
    id          BIGSERIAL PRIMARY KEY,
    patient_id  BIGINT       NOT NULL,
    allergen    VARCHAR(120) NOT NULL,
    reaction    VARCHAR(255),
    severity    VARCHAR(20)  NOT NULL,
    noted_at    DATE,
    sort_order  INTEGER      NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patient_allergies_patient_id ON patient_allergies(patient_id);

CREATE TABLE patient_conditions (
    id              BIGSERIAL PRIMARY KEY,
    patient_id       BIGINT       NOT NULL,
    condition_name   VARCHAR(150) NOT NULL,
    icd10_code       VARCHAR(10),
    status           VARCHAR(30)  NOT NULL,
    diagnosed_at     DATE,
    notes            TEXT,
    sort_order       INTEGER      NOT NULL DEFAULT 0,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patient_conditions_patient_id ON patient_conditions(patient_id);

CREATE TABLE patient_medications (
    id               BIGSERIAL PRIMARY KEY,
    patient_id       BIGINT       NOT NULL,
    medication_name  VARCHAR(150) NOT NULL,
    dose             VARCHAR(100),
    route            VARCHAR(50),
    frequency        VARCHAR(100),
    status           VARCHAR(30)  NOT NULL,
    started_at       DATE,
    instructions     TEXT,
    sort_order       INTEGER      NOT NULL DEFAULT 0,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patient_medications_patient_id ON patient_medications(patient_id);
