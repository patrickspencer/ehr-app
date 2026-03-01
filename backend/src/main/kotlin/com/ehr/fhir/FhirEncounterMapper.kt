package com.ehr.fhir

import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.EncounterDto
import com.ehr.dto.Icd10CodeDto
import com.ehr.dto.CptCodeDto
import org.hl7.fhir.r4.model.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.Date

object FhirEncounterMapper {

    private const val CREATED_AT_EXT = "http://ehr.com/fhir/StructureDefinition/created-at"
    private const val ENCOUNTER_TYPE_EXT = "http://ehr.com/fhir/StructureDefinition/encounter-type"
    private const val PROVIDER_EXT = "http://ehr.com/fhir/StructureDefinition/provider"
    private const val REASON_EXT = "http://ehr.com/fhir/StructureDefinition/reason"
    private const val ICD10_SYSTEM = "http://hl7.org/fhir/sid/icd-10-cm"
    private const val CPT_SYSTEM = "http://www.ama-assn.org/go/cpt"

    fun toFhirEncounter(patientFhirId: String, request: EncounterCreateRequest): Encounter {
        val encounter = Encounter()
        encounter.subject = Reference("Patient/$patientFhirId")
        encounter.status = mapStatusToFhir(request.status)
        encounter.class_ = Coding("http://terminology.hl7.org/CodeSystem/v3-ActCode", "AMB", "ambulatory")

        encounter.period = Period().setStart(localDateToDate(request.encounterDate))

        encounter.addExtension(Extension(ENCOUNTER_TYPE_EXT, StringType(request.encounterType)))
        encounter.addExtension(Extension(PROVIDER_EXT, StringType(request.provider)))
        request.reason?.let {
            encounter.addExtension(Extension(REASON_EXT, StringType(it)))
        }

        encounter.addExtension(Extension(CREATED_AT_EXT, InstantType(Date.from(
            LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()
        ))))

        return encounter
    }

    fun updateFhirEncounter(existing: Encounter, request: EncounterCreateRequest): Encounter {
        existing.status = mapStatusToFhir(request.status)
        existing.period = Period().setStart(localDateToDate(request.encounterDate))

        existing.extension.removeIf { it.url in listOf(ENCOUNTER_TYPE_EXT, PROVIDER_EXT, REASON_EXT) }
        existing.addExtension(Extension(ENCOUNTER_TYPE_EXT, StringType(request.encounterType)))
        existing.addExtension(Extension(PROVIDER_EXT, StringType(request.provider)))
        request.reason?.let {
            existing.addExtension(Extension(REASON_EXT, StringType(it)))
        }

        return existing
    }

    fun toDto(
        encounter: Encounter,
        legacyId: Long,
        patientLegacyId: Long,
        diagnoses: List<Icd10CodeDto>,
        procedures: List<CptCodeDto>
    ): EncounterDto {
        val createdAtExt = encounter.getExtensionByUrl(CREATED_AT_EXT)
        val createdAt = if (createdAtExt?.value is InstantType) {
            dateToLocalDateTime((createdAtExt.value as InstantType).value)
        } else {
            encounter.meta?.lastUpdated?.let { dateToLocalDateTime(it) } ?: LocalDateTime.now()
        }
        val updatedAt = encounter.meta?.lastUpdated?.let { dateToLocalDateTime(it) } ?: createdAt

        val encounterDate = encounter.period?.start?.let { dateToLocalDate(it) } ?: LocalDate.now()
        val encounterType = (encounter.getExtensionByUrl(ENCOUNTER_TYPE_EXT)?.value as? StringType)?.value ?: ""
        val provider = (encounter.getExtensionByUrl(PROVIDER_EXT)?.value as? StringType)?.value ?: ""
        val reason = (encounter.getExtensionByUrl(REASON_EXT)?.value as? StringType)?.value

        return EncounterDto(
            id = legacyId,
            patientId = patientLegacyId,
            encounterDate = encounterDate,
            encounterType = encounterType,
            status = mapStatusFromFhir(encounter.status),
            provider = provider,
            reason = reason,
            diagnoses = diagnoses.sortedBy { it.code },
            procedures = procedures.sortedBy { it.code },
            createdAt = createdAt,
            updatedAt = updatedAt
        )
    }

    fun toFhirCondition(patientFhirId: String, encounterFhirId: String, icdCode: String, icdDescription: String): Condition {
        val condition = Condition()
        condition.subject = Reference("Patient/$patientFhirId")
        condition.encounter = Reference("Encounter/$encounterFhirId")
        condition.code = CodeableConcept(Coding(ICD10_SYSTEM, icdCode, icdDescription))
        condition.clinicalStatus = CodeableConcept(
            Coding("http://terminology.hl7.org/CodeSystem/condition-clinical", "active", "Active")
        )
        return condition
    }

    fun toFhirProcedure(patientFhirId: String, encounterFhirId: String, cptCode: String, cptDescription: String): Procedure {
        val procedure = Procedure()
        procedure.subject = Reference("Patient/$patientFhirId")
        procedure.encounter = Reference("Encounter/$encounterFhirId")
        procedure.code = CodeableConcept(Coding(CPT_SYSTEM, cptCode, cptDescription))
        procedure.status = Procedure.ProcedureStatus.COMPLETED
        return procedure
    }

    fun conditionToIcd10Dto(condition: Condition, legacyCodeId: Long): Icd10CodeDto {
        val coding = condition.code?.codingFirstRep
        return Icd10CodeDto(
            id = legacyCodeId,
            code = coding?.code ?: "",
            description = coding?.display ?: ""
        )
    }

    fun procedureToCptDto(procedure: Procedure, legacyCodeId: Long): CptCodeDto {
        val coding = procedure.code?.codingFirstRep
        return CptCodeDto(
            id = legacyCodeId,
            code = coding?.code ?: "",
            description = coding?.display ?: ""
        )
    }

    private fun mapStatusToFhir(status: String): Encounter.EncounterStatus =
        when (status.uppercase()) {
            "PLANNED" -> Encounter.EncounterStatus.PLANNED
            "IN_PROGRESS" -> Encounter.EncounterStatus.INPROGRESS
            "COMPLETED" -> Encounter.EncounterStatus.FINISHED
            "CANCELLED" -> Encounter.EncounterStatus.CANCELLED
            else -> Encounter.EncounterStatus.UNKNOWN
        }

    private fun mapStatusFromFhir(status: Encounter.EncounterStatus?): String =
        when (status) {
            Encounter.EncounterStatus.PLANNED -> "PLANNED"
            Encounter.EncounterStatus.INPROGRESS -> "IN_PROGRESS"
            Encounter.EncounterStatus.FINISHED -> "COMPLETED"
            Encounter.EncounterStatus.CANCELLED -> "CANCELLED"
            else -> "PLANNED"
        }

    private fun localDateToDate(localDate: LocalDate): Date =
        Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant())

    private fun dateToLocalDate(date: Date): LocalDate =
        date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()

    private fun dateToLocalDateTime(date: Date): LocalDateTime =
        date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
}
