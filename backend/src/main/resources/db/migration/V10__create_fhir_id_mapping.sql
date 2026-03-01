CREATE TABLE fhir_id_mapping (
    id            BIGSERIAL    PRIMARY KEY,
    resource_type VARCHAR(50)  NOT NULL,
    legacy_id     BIGINT       NOT NULL,
    fhir_id       VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX idx_fhir_mapping_type_legacy ON fhir_id_mapping(resource_type, legacy_id);
CREATE UNIQUE INDEX idx_fhir_mapping_type_fhir ON fhir_id_mapping(resource_type, fhir_id);

CREATE SEQUENCE legacy_id_seq START WITH 1000;
