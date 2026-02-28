CREATE TABLE icd10_codes (
    id          BIGSERIAL    PRIMARY KEY,
    code        VARCHAR(10)  NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE cpt_codes (
    id          BIGSERIAL    PRIMARY KEY,
    code        VARCHAR(10)  NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE encounter_diagnoses (
    encounter_id BIGINT NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    icd10_code_id BIGINT NOT NULL REFERENCES icd10_codes(id) ON DELETE CASCADE,
    PRIMARY KEY (encounter_id, icd10_code_id)
);

CREATE TABLE encounter_procedures (
    encounter_id BIGINT NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    cpt_code_id  BIGINT NOT NULL REFERENCES cpt_codes(id) ON DELETE CASCADE,
    PRIMARY KEY (encounter_id, cpt_code_id)
);
