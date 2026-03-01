package com.ehr.repository

import com.ehr.model.FhirIdMapping
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.Optional

interface FhirIdMappingRepository : JpaRepository<FhirIdMapping, Long> {

    fun findByResourceTypeAndLegacyId(resourceType: String, legacyId: Long): Optional<FhirIdMapping>

    fun findByResourceTypeAndFhirId(resourceType: String, fhirId: String): Optional<FhirIdMapping>

    @Query(value = "SELECT nextval('legacy_id_seq')", nativeQuery = true)
    fun nextLegacyId(): Long
}
