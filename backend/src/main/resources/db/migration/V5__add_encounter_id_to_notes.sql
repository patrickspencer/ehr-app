ALTER TABLE notes ADD COLUMN encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL;

CREATE INDEX idx_notes_encounter_id ON notes(encounter_id);
