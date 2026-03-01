package com.ehr.service

import com.ehr.model.FhirIdMapping
import com.ehr.repository.FhirIdMappingRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FhirIdMappingService(private val repository: FhirIdMappingRepository) {

    fun getFhirId(resourceType: String, legacyId: Long): String? =
        repository.findByResourceTypeAndLegacyId(resourceType, legacyId)
            .map { it.fhirId }
            .orElse(null)

    fun getLegacyId(resourceType: String, fhirId: String): Long? =
        repository.findByResourceTypeAndFhirId(resourceType, fhirId)
            .map { it.legacyId }
            .orElse(null)

    fun requireFhirId(resourceType: String, legacyId: Long): String =
        getFhirId(resourceType, legacyId)
            ?: throw NoSuchElementException("No FHIR mapping for $resourceType with legacy id $legacyId")

    fun requireLegacyId(resourceType: String, fhirId: String): Long =
        getLegacyId(resourceType, fhirId)
            ?: throw NoSuchElementException("No legacy mapping for $resourceType with FHIR id $fhirId")

    @Transactional
    fun createMapping(resourceType: String, legacyId: Long, fhirId: String): FhirIdMapping =
        repository.save(FhirIdMapping(
            resourceType = resourceType,
            legacyId = legacyId,
            fhirId = fhirId
        ))

    @Transactional
    fun getOrCreateLegacyId(resourceType: String, fhirId: String): Long {
        val existing = getLegacyId(resourceType, fhirId)
        if (existing != null) return existing

        val newLegacyId = nextLegacyId()
        createMapping(resourceType, newLegacyId, fhirId)
        return newLegacyId
    }

    private fun nextLegacyId(): Long = repository.nextLegacyId()
}
