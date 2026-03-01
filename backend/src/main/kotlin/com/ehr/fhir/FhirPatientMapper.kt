package com.ehr.fhir

import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import org.hl7.fhir.r4.model.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.Date

object FhirPatientMapper {

    private const val CREATED_AT_EXT = "http://ehr.com/fhir/StructureDefinition/created-at"
    private const val PHONE_EXT = "http://ehr.com/fhir/StructureDefinition/phone"
    private const val EMAIL_EXT = "http://ehr.com/fhir/StructureDefinition/email"
    private const val ADDRESS_EXT = "http://ehr.com/fhir/StructureDefinition/address"

    fun toFhirPatient(request: PatientCreateRequest): Patient {
        val patient = Patient()
        patient.addName()
            .setFamily(request.lastName)
            .addGiven(request.firstName)

        patient.birthDate = localDateToDate(request.dateOfBirth)

        request.gender?.let {
            patient.gender = mapGenderToFhir(it)
        }

        request.phone?.let {
            patient.addExtension(Extension(PHONE_EXT, StringType(it)))
        }
        request.email?.let {
            patient.addExtension(Extension(EMAIL_EXT, StringType(it)))
        }
        request.address?.let {
            patient.addExtension(Extension(ADDRESS_EXT, StringType(it)))
        }

        patient.addExtension(Extension(CREATED_AT_EXT, InstantType(Date.from(
            LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()
        ))))

        return patient
    }

    fun updateFhirPatient(existing: Patient, request: PatientCreateRequest): Patient {
        existing.name.clear()
        existing.addName()
            .setFamily(request.lastName)
            .addGiven(request.firstName)

        existing.birthDate = localDateToDate(request.dateOfBirth)

        existing.gender = request.gender?.let { mapGenderToFhir(it) }
            ?: Enumerations.AdministrativeGender.UNKNOWN

        existing.extension.removeIf { it.url == PHONE_EXT }
        existing.extension.removeIf { it.url == EMAIL_EXT }
        existing.extension.removeIf { it.url == ADDRESS_EXT }

        request.phone?.let {
            existing.addExtension(Extension(PHONE_EXT, StringType(it)))
        }
        request.email?.let {
            existing.addExtension(Extension(EMAIL_EXT, StringType(it)))
        }
        request.address?.let {
            existing.addExtension(Extension(ADDRESS_EXT, StringType(it)))
        }

        return existing
    }

    fun toDto(patient: Patient, legacyId: Long): PatientDto {
        val name = patient.nameFirstRep
        val createdAtExt = patient.getExtensionByUrl(CREATED_AT_EXT)
        val createdAt = if (createdAtExt?.value is InstantType) {
            dateToLocalDateTime((createdAtExt.value as InstantType).value)
        } else {
            patient.meta?.lastUpdated?.let { dateToLocalDateTime(it) } ?: LocalDateTime.now()
        }
        val updatedAt = patient.meta?.lastUpdated?.let { dateToLocalDateTime(it) } ?: createdAt

        return PatientDto(
            id = legacyId,
            firstName = name.givenAsSingleString ?: "",
            lastName = name.family ?: "",
            dateOfBirth = dateToLocalDate(patient.birthDate),
            gender = mapGenderFromFhir(patient.gender),
            phone = (patient.getExtensionByUrl(PHONE_EXT)?.value as? StringType)?.value,
            email = (patient.getExtensionByUrl(EMAIL_EXT)?.value as? StringType)?.value,
            address = (patient.getExtensionByUrl(ADDRESS_EXT)?.value as? StringType)?.value,
            createdAt = createdAt,
            updatedAt = updatedAt
        )
    }

    private fun mapGenderToFhir(gender: String): Enumerations.AdministrativeGender =
        when (gender.uppercase()) {
            "MALE", "M" -> Enumerations.AdministrativeGender.MALE
            "FEMALE", "F" -> Enumerations.AdministrativeGender.FEMALE
            "OTHER" -> Enumerations.AdministrativeGender.OTHER
            else -> Enumerations.AdministrativeGender.UNKNOWN
        }

    private fun mapGenderFromFhir(gender: Enumerations.AdministrativeGender?): String? =
        when (gender) {
            Enumerations.AdministrativeGender.MALE -> "Male"
            Enumerations.AdministrativeGender.FEMALE -> "Female"
            Enumerations.AdministrativeGender.OTHER -> "Other"
            else -> null
        }

    private fun localDateToDate(localDate: LocalDate): Date =
        Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant())

    private fun dateToLocalDate(date: Date?): LocalDate =
        date?.toInstant()?.atZone(ZoneId.systemDefault())?.toLocalDate() ?: LocalDate.now()

    private fun dateToLocalDateTime(date: Date): LocalDateTime =
        date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
}
