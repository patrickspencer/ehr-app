package com.ehr.service

import ca.uhn.fhir.rest.client.api.IGenericClient
import ca.uhn.fhir.rest.gclient.StringClientParam
import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import com.ehr.fhir.FhirPatientMapper
import org.hl7.fhir.r4.model.Bundle
import org.hl7.fhir.r4.model.Patient
import org.springframework.stereotype.Service

@Service
class PatientService(
    private val fhirClient: IGenericClient,
    private val idMapping: FhirIdMappingService
) {

    companion object {
        private const val RESOURCE_TYPE = "Patient"
    }

    fun findAll(query: String?): List<PatientDto> {
        val searchQuery = fhirClient.search<Bundle>()
            .forResource("Patient")

        if (!query.isNullOrBlank()) {
            searchQuery.where(StringClientParam("name").contains().value(query))
        }

        searchQuery.count(500)

        @Suppress("UNCHECKED_CAST")
        val bundle = searchQuery.returnBundle(Bundle::class.java).execute() as Bundle
        val entries = bundle.entry ?: return emptyList()
        return entries.mapNotNull { entry ->
            val patient = entry.resource as? Patient ?: return@mapNotNull null
            val legacyId = idMapping.getOrCreateLegacyId(RESOURCE_TYPE, patient.idElement.idPart)
            FhirPatientMapper.toDto(patient, legacyId)
        }
    }

    fun getById(id: Long): PatientDto {
        val fhirId = idMapping.requireFhirId(RESOURCE_TYPE, id)
        val patient = fhirClient.read()
            .resource(Patient::class.java)
            .withId(fhirId)
            .execute()
            ?: throw NoSuchElementException("Patient not found with id: $id")
        return FhirPatientMapper.toDto(patient, id)
    }

    fun create(request: PatientCreateRequest): PatientDto {
        val fhirPatient = FhirPatientMapper.toFhirPatient(request)
        val outcome = fhirClient.create()
            .resource(fhirPatient)
            .execute()
        val created = outcome.resource as Patient
        val fhirId = created.idElement.idPart
        val legacyId = idMapping.getOrCreateLegacyId(RESOURCE_TYPE, fhirId)
        return FhirPatientMapper.toDto(created, legacyId)
    }

    fun update(id: Long, request: PatientCreateRequest): PatientDto {
        val fhirId = idMapping.requireFhirId(RESOURCE_TYPE, id)
        val existing = fhirClient.read()
            .resource(Patient::class.java)
            .withId(fhirId)
            .execute()
            ?: throw NoSuchElementException("Patient not found with id: $id")

        FhirPatientMapper.updateFhirPatient(existing, request)
        val outcome = fhirClient.update()
            .resource(existing)
            .execute()
        val updated = outcome.resource as Patient
        return FhirPatientMapper.toDto(updated, id)
    }

    fun delete(id: Long) {
        val fhirId = idMapping.requireFhirId(RESOURCE_TYPE, id)
        fhirClient.delete()
            .resourceById("Patient", fhirId)
            .execute()
    }
}
