package com.ehr.model

import jakarta.persistence.*

@Entity
@Table(name = "fhir_id_mapping")
class FhirIdMapping(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(name = "resource_type", nullable = false, length = 50)
    var resourceType: String = "",

    @Column(name = "legacy_id", nullable = false)
    var legacyId: Long = 0,

    @Column(name = "fhir_id", nullable = false, length = 255)
    var fhirId: String = ""
)
