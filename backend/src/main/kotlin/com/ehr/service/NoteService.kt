package com.ehr.service

import ca.uhn.fhir.rest.client.api.IGenericClient
import ca.uhn.fhir.rest.gclient.ReferenceClientParam
import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto
import com.ehr.fhir.FhirNoteMapper
import org.hl7.fhir.r4.model.Bundle
import org.hl7.fhir.r4.model.DocumentReference
import org.springframework.stereotype.Service

@Service
class NoteService(
    private val fhirClient: IGenericClient,
    private val idMapping: FhirIdMappingService
) {

    companion object {
        private const val RESOURCE_TYPE = "DocumentReference"
        private const val PATIENT_TYPE = "Patient"
        private const val ENCOUNTER_TYPE = "Encounter"
    }

    fun getByPatientId(patientId: Long): List<NoteDto> {
        val patientFhirId = idMapping.requireFhirId(PATIENT_TYPE, patientId)

        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("DocumentReference")
            .where(ReferenceClientParam("subject").hasId("Patient/$patientFhirId"))
            .sort().descending("_lastUpdated")
            .count(500)
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        return bundle.entry?.mapNotNull { entry ->
            val doc = entry.resource as? DocumentReference ?: return@mapNotNull null
            val legacyId = idMapping.getOrCreateLegacyId(RESOURCE_TYPE, doc.idElement.idPart)

            // Check for encounter reference
            val encounterLegacyId = doc.context?.encounter?.firstOrNull()?.referenceElement?.idPart?.let { encFhirId ->
                idMapping.getLegacyId(ENCOUNTER_TYPE, encFhirId)
            }

            FhirNoteMapper.toDto(doc, legacyId, patientId, encounterLegacyId)
        } ?: emptyList()
    }

    fun create(patientId: Long, request: NoteCreateRequest): NoteDto {
        val patientFhirId = idMapping.requireFhirId(PATIENT_TYPE, patientId)
        val doc = FhirNoteMapper.toFhirDocumentReference(patientFhirId, request)

        val outcome = fhirClient.create()
            .resource(doc)
            .execute()
        val created = outcome.resource as DocumentReference
        val fhirId = created.idElement.idPart
        val legacyId = idMapping.getOrCreateLegacyId(RESOURCE_TYPE, fhirId)

        return FhirNoteMapper.toDto(created, legacyId, patientId, null)
    }

    fun update(noteId: Long, request: NoteCreateRequest): NoteDto {
        val fhirId = idMapping.requireFhirId(RESOURCE_TYPE, noteId)
        val existing = fhirClient.read()
            .resource(DocumentReference::class.java)
            .withId(fhirId)
            .execute()
            ?: throw NoSuchElementException("Note not found with id: $noteId")

        val patientFhirId = existing.subject?.referenceElement?.idPart ?: ""
        val patientLegacyId = idMapping.requireLegacyId(PATIENT_TYPE, patientFhirId)

        val encounterLegacyId = existing.context?.encounter?.firstOrNull()?.referenceElement?.idPart?.let { encFhirId ->
            idMapping.getLegacyId(ENCOUNTER_TYPE, encFhirId)
        }

        FhirNoteMapper.updateFhirDocumentReference(existing, request)
        val outcome = fhirClient.update()
            .resource(existing)
            .execute()
        val updated = outcome.resource as DocumentReference

        return FhirNoteMapper.toDto(updated, noteId, patientLegacyId, encounterLegacyId)
    }

    fun delete(noteId: Long) {
        val fhirId = idMapping.requireFhirId(RESOURCE_TYPE, noteId)
        fhirClient.delete()
            .resourceById("DocumentReference", fhirId)
            .execute()
    }
}
