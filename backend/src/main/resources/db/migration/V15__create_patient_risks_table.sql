CREATE TABLE patient_risks (
    id          BIGSERIAL PRIMARY KEY,
    patient_id  BIGINT       NOT NULL,
    risk_name   VARCHAR(120) NOT NULL,
    level       VARCHAR(20)  NOT NULL,
    details     VARCHAR(255),
    sort_order  INTEGER      NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patient_risks_patient_id ON patient_risks(patient_id);
