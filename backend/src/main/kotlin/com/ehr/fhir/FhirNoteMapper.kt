package com.ehr.fhir

import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto
import org.hl7.fhir.r4.model.*
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.Base64
import java.util.Date

object FhirNoteMapper {

    private const val CREATED_AT_EXT = "http://ehr.com/fhir/StructureDefinition/created-at"

    fun toFhirDocumentReference(patientFhirId: String, request: NoteCreateRequest): DocumentReference {
        val doc = DocumentReference()
        doc.subject = Reference("Patient/$patientFhirId")
        doc.status = Enumerations.DocumentReferenceStatus.CURRENT

        doc.addAuthor().display = request.author

        val attachment = Attachment()
        attachment.contentType = "text/plain"
        attachment.data = Base64.getEncoder().encode(request.content.toByteArray())
        doc.addContent().attachment = attachment

        doc.addExtension(Extension(CREATED_AT_EXT, InstantType(Date.from(
            LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()
        ))))

        return doc
    }

    fun updateFhirDocumentReference(existing: DocumentReference, request: NoteCreateRequest): DocumentReference {
        existing.author.clear()
        existing.addAuthor().display = request.author

        existing.content.clear()
        val attachment = Attachment()
        attachment.contentType = "text/plain"
        attachment.data = Base64.getEncoder().encode(request.content.toByteArray())
        existing.addContent().attachment = attachment

        return existing
    }

    fun toDto(doc: DocumentReference, legacyId: Long, patientLegacyId: Long, encounterLegacyId: Long?): NoteDto {
        val createdAtExt = doc.getExtensionByUrl(CREATED_AT_EXT)
        val createdAt = if (createdAtExt?.value is InstantType) {
            dateToLocalDateTime((createdAtExt.value as InstantType).value)
        } else {
            doc.meta?.lastUpdated?.let { dateToLocalDateTime(it) } ?: LocalDateTime.now()
        }
        val updatedAt = doc.meta?.lastUpdated?.let { dateToLocalDateTime(it) } ?: createdAt

        val content = doc.contentFirstRep?.attachment?.data?.let {
            String(Base64.getDecoder().decode(it))
        } ?: ""

        val author = doc.authorFirstRep?.display ?: ""

        return NoteDto(
            id = legacyId,
            patientId = patientLegacyId,
            encounterId = encounterLegacyId,
            content = content,
            author = author,
            createdAt = createdAt,
            updatedAt = updatedAt
        )
    }

    private fun dateToLocalDateTime(date: Date): LocalDateTime =
        date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
}
