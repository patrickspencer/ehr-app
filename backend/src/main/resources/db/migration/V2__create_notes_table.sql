CREATE TABLE notes (
    id         BIGSERIAL PRIMARY KEY,
    patient_id BIGINT       NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    content    TEXT         NOT NULL,
    author     VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_patient_id ON notes(patient_id);
