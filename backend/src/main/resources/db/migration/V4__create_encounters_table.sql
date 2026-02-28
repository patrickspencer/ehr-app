CREATE TABLE encounters (
    id              BIGSERIAL    PRIMARY KEY,
    patient_id      BIGINT       NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    encounter_date  DATE         NOT NULL,
    encounter_type  VARCHAR(50)  NOT NULL,
    status          VARCHAR(30)  NOT NULL DEFAULT 'PLANNED',
    provider        VARCHAR(100) NOT NULL,
    reason          TEXT,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_encounters_patient_id ON encounters(patient_id);
CREATE INDEX idx_encounters_date ON encounters(encounter_date);
