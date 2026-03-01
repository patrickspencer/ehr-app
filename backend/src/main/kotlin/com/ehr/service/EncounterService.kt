package com.ehr.service

import ca.uhn.fhir.rest.client.api.IGenericClient
import ca.uhn.fhir.rest.gclient.ReferenceClientParam
import ca.uhn.fhir.rest.gclient.TokenClientParam
import com.ehr.dto.CptCodeDto
import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.EncounterDto
import com.ehr.dto.Icd10CodeDto
import com.ehr.fhir.FhirEncounterMapper
import com.ehr.repository.CptCodeRepository
import com.ehr.repository.Icd10CodeRepository
import org.hl7.fhir.r4.model.Bundle
import org.hl7.fhir.r4.model.Condition
import org.hl7.fhir.r4.model.Encounter
import org.hl7.fhir.r4.model.Procedure
import org.springframework.stereotype.Service

@Service
class EncounterService(
    private val fhirClient: IGenericClient,
    private val idMapping: FhirIdMappingService,
    private val icd10CodeRepository: Icd10CodeRepository,
    private val cptCodeRepository: CptCodeRepository
) {

    companion object {
        private const val ENCOUNTER_TYPE = "Encounter"
        private const val PATIENT_TYPE = "Patient"
        private const val CONDITION_TYPE = "Condition"
        private const val PROCEDURE_TYPE = "Procedure"
    }

    fun getByPatientId(patientId: Long): List<EncounterDto> {
        val patientFhirId = idMapping.requireFhirId(PATIENT_TYPE, patientId)

        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("Encounter")
            .where(ReferenceClientParam("subject").hasId("Patient/$patientFhirId"))
            .revInclude(Condition.INCLUDE_ENCOUNTER)
            .revInclude(Procedure.INCLUDE_ENCOUNTER)
            .count(500)
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        return assembleEncounterDtos(bundle, patientId)
            .sortedByDescending { it.encounterDate }
    }

    fun getById(encounterId: Long): EncounterDto {
        val encounterFhirId = idMapping.requireFhirId(ENCOUNTER_TYPE, encounterId)

        val encounter = fhirClient.read()
            .resource(Encounter::class.java)
            .withId(encounterFhirId)
            .execute()
            ?: throw NoSuchElementException("Encounter not found with id: $encounterId")

        val patientFhirId = encounter.subject.referenceElement.idPart
        val patientLegacyId = idMapping.requireLegacyId(PATIENT_TYPE, patientFhirId)

        val diagnoses = getConditionsForEncounter(encounterFhirId)
        val procedures = getProceduresForEncounter(encounterFhirId)

        return FhirEncounterMapper.toDto(encounter, encounterId, patientLegacyId, diagnoses, procedures)
    }

    fun create(patientId: Long, request: EncounterCreateRequest): EncounterDto {
        val patientFhirId = idMapping.requireFhirId(PATIENT_TYPE, patientId)
        val fhirEncounter = FhirEncounterMapper.toFhirEncounter(patientFhirId, request)

        val outcome = fhirClient.create()
            .resource(fhirEncounter)
            .execute()
        val created = outcome.resource as Encounter
        val fhirId = created.idElement.idPart
        val legacyId = idMapping.getOrCreateLegacyId(ENCOUNTER_TYPE, fhirId)

        return FhirEncounterMapper.toDto(created, legacyId, patientId, emptyList(), emptyList())
    }

    fun update(encounterId: Long, request: EncounterCreateRequest): EncounterDto {
        val encounterFhirId = idMapping.requireFhirId(ENCOUNTER_TYPE, encounterId)
        val existing = fhirClient.read()
            .resource(Encounter::class.java)
            .withId(encounterFhirId)
            .execute()
            ?: throw NoSuchElementException("Encounter not found with id: $encounterId")

        val patientFhirId = existing.subject.referenceElement.idPart
        val patientLegacyId = idMapping.requireLegacyId(PATIENT_TYPE, patientFhirId)

        FhirEncounterMapper.updateFhirEncounter(existing, request)
        val outcome = fhirClient.update()
            .resource(existing)
            .execute()
        val updated = outcome.resource as Encounter

        val diagnoses = getConditionsForEncounter(encounterFhirId)
        val procedures = getProceduresForEncounter(encounterFhirId)

        return FhirEncounterMapper.toDto(updated, encounterId, patientLegacyId, diagnoses, procedures)
    }

    fun delete(encounterId: Long) {
        val encounterFhirId = idMapping.requireFhirId(ENCOUNTER_TYPE, encounterId)

        deleteConditionsForEncounter(encounterFhirId)
        deleteProceduresForEncounter(encounterFhirId)

        fhirClient.delete()
            .resourceById("Encounter", encounterFhirId)
            .execute()
    }

    fun addDiagnosis(encounterId: Long, codeId: Long): EncounterDto {
        val encounterFhirId = idMapping.requireFhirId(ENCOUNTER_TYPE, encounterId)
        val encounter = fhirClient.read()
            .resource(Encounter::class.java)
            .withId(encounterFhirId)
            .execute()

        val patientFhirId = encounter.subject.referenceElement.idPart
        val patientLegacyId = idMapping.requireLegacyId(PATIENT_TYPE, patientFhirId)

        val icd10Code = icd10CodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("ICD-10 code not found with id: $codeId") }

        // Fetch existing before create to avoid search indexing delay
        val existingDiagnoses = getConditionsForEncounter(encounterFhirId)
        val procedures = getProceduresForEncounter(encounterFhirId)

        val condition = FhirEncounterMapper.toFhirCondition(
            patientFhirId, encounterFhirId, icd10Code.code, icd10Code.description
        )
        fhirClient.create().resource(condition).execute()

        val newDiagnosis = Icd10CodeDto(id = codeId, code = icd10Code.code, description = icd10Code.description)
        val diagnoses = existingDiagnoses + newDiagnosis

        return FhirEncounterMapper.toDto(encounter, encounterId, patientLegacyId, diagnoses, procedures)
    }

    fun removeDiagnosis(encounterId: Long, codeId: Long): EncounterDto {
        val encounterFhirId = idMapping.requireFhirId(ENCOUNTER_TYPE, encounterId)
        val encounter = fhirClient.read()
            .resource(Encounter::class.java)
            .withId(encounterFhirId)
            .execute()

        val patientFhirId = encounter.subject.referenceElement.idPart
        val patientLegacyId = idMapping.requireLegacyId(PATIENT_TYPE, patientFhirId)

        val icd10Code = icd10CodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("ICD-10 code not found with id: $codeId") }

        // Fetch existing before delete
        val existingDiagnoses = getConditionsForEncounter(encounterFhirId)
        val procedures = getProceduresForEncounter(encounterFhirId)

        // Find and delete the Condition by encounter + code
        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("Condition")
            .where(ReferenceClientParam("encounter").hasId("Encounter/$encounterFhirId"))
            .where(TokenClientParam("code").exactly().systemAndCode(
                "http://hl7.org/fhir/sid/icd-10-cm", icd10Code.code
            ))
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        bundle.entry?.forEach { entry ->
            fhirClient.delete()
                .resourceById("Condition", (entry.resource as Condition).idElement.idPart)
                .execute()
        }

        val diagnoses = existingDiagnoses.filter { it.id != codeId }

        return FhirEncounterMapper.toDto(encounter, encounterId, patientLegacyId, diagnoses, procedures)
    }

    fun addProcedure(encounterId: Long, codeId: Long): EncounterDto {
        val encounterFhirId = idMapping.requireFhirId(ENCOUNTER_TYPE, encounterId)
        val encounter = fhirClient.read()
            .resource(Encounter::class.java)
            .withId(encounterFhirId)
            .execute()

        val patientFhirId = encounter.subject.referenceElement.idPart
        val patientLegacyId = idMapping.requireLegacyId(PATIENT_TYPE, patientFhirId)

        val cptCode = cptCodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("CPT code not found with id: $codeId") }

        // Fetch existing before create to avoid search indexing delay
        val diagnoses = getConditionsForEncounter(encounterFhirId)
        val existingProcedures = getProceduresForEncounter(encounterFhirId)

        val procedure = FhirEncounterMapper.toFhirProcedure(
            patientFhirId, encounterFhirId, cptCode.code, cptCode.description
        )
        fhirClient.create().resource(procedure).execute()

        val newProcedure = CptCodeDto(id = codeId, code = cptCode.code, description = cptCode.description)
        val procedures = existingProcedures + newProcedure

        return FhirEncounterMapper.toDto(encounter, encounterId, patientLegacyId, diagnoses, procedures)
    }

    fun removeProcedure(encounterId: Long, codeId: Long): EncounterDto {
        val encounterFhirId = idMapping.requireFhirId(ENCOUNTER_TYPE, encounterId)
        val encounter = fhirClient.read()
            .resource(Encounter::class.java)
            .withId(encounterFhirId)
            .execute()

        val patientFhirId = encounter.subject.referenceElement.idPart
        val patientLegacyId = idMapping.requireLegacyId(PATIENT_TYPE, patientFhirId)

        val cptCode = cptCodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("CPT code not found with id: $codeId") }

        // Fetch existing before delete
        val diagnoses = getConditionsForEncounter(encounterFhirId)
        val existingProcedures = getProceduresForEncounter(encounterFhirId)

        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("Procedure")
            .where(ReferenceClientParam("encounter").hasId("Encounter/$encounterFhirId"))
            .where(TokenClientParam("code").exactly().systemAndCode(
                "http://www.ama-assn.org/go/cpt", cptCode.code
            ))
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        bundle.entry?.forEach { entry ->
            fhirClient.delete()
                .resourceById("Procedure", (entry.resource as Procedure).idElement.idPart)
                .execute()
        }

        val procedures = existingProcedures.filter { it.id != codeId }

        return FhirEncounterMapper.toDto(encounter, encounterId, patientLegacyId, diagnoses, procedures)
    }

    private fun assembleEncounterDtos(bundle: Bundle, patientLegacyId: Long): List<EncounterDto> {
        val encounters = mutableListOf<Encounter>()
        val conditionsByEncounter = mutableMapOf<String, MutableList<Condition>>()
        val proceduresByEncounter = mutableMapOf<String, MutableList<Procedure>>()

        bundle.entry?.forEach { entry ->
            when (val resource = entry.resource) {
                is Encounter -> encounters.add(resource)
                is Condition -> {
                    val encRef = resource.encounter?.referenceElement?.idPart ?: return@forEach
                    conditionsByEncounter.getOrPut(encRef) { mutableListOf() }.add(resource)
                }
                is Procedure -> {
                    val encRef = resource.encounter?.referenceElement?.idPart ?: return@forEach
                    proceduresByEncounter.getOrPut(encRef) { mutableListOf() }.add(resource)
                }
            }
        }

        return encounters.map { encounter ->
            val encFhirId = encounter.idElement.idPart
            val legacyId = idMapping.getOrCreateLegacyId(ENCOUNTER_TYPE, encFhirId)

            val diagnoses = (conditionsByEncounter[encFhirId] ?: emptyList()).map { condition ->
                val code = condition.code?.codingFirstRep?.code ?: ""
                val icd10 = icd10CodeRepository.findByCode(code)
                FhirEncounterMapper.conditionToIcd10Dto(condition, icd10?.id ?: 0)
            }

            val procedures = (proceduresByEncounter[encFhirId] ?: emptyList()).map { procedure ->
                val code = procedure.code?.codingFirstRep?.code ?: ""
                val cpt = cptCodeRepository.findByCode(code)
                FhirEncounterMapper.procedureToCptDto(procedure, cpt?.id ?: 0)
            }

            FhirEncounterMapper.toDto(encounter, legacyId, patientLegacyId, diagnoses, procedures)
        }
    }

    private fun getConditionsForEncounter(encounterFhirId: String): List<Icd10CodeDto> {
        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("Condition")
            .where(ReferenceClientParam("encounter").hasId("Encounter/$encounterFhirId"))
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        return bundle.entry?.mapNotNull { entry ->
            val condition = entry.resource as? Condition ?: return@mapNotNull null
            val code = condition.code?.codingFirstRep?.code ?: ""
            val icd10 = icd10CodeRepository.findByCode(code)
            FhirEncounterMapper.conditionToIcd10Dto(condition, icd10?.id ?: 0)
        } ?: emptyList()
    }

    private fun getProceduresForEncounter(encounterFhirId: String): List<CptCodeDto> {
        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("Procedure")
            .where(ReferenceClientParam("encounter").hasId("Encounter/$encounterFhirId"))
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        return bundle.entry?.mapNotNull { entry ->
            val procedure = entry.resource as? Procedure ?: return@mapNotNull null
            val code = procedure.code?.codingFirstRep?.code ?: ""
            val cpt = cptCodeRepository.findByCode(code)
            FhirEncounterMapper.procedureToCptDto(procedure, cpt?.id ?: 0)
        } ?: emptyList()
    }

    private fun deleteConditionsForEncounter(encounterFhirId: String) {
        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("Condition")
            .where(ReferenceClientParam("encounter").hasId("Encounter/$encounterFhirId"))
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        bundle.entry?.forEach { entry ->
            fhirClient.delete()
                .resourceById("Condition", (entry.resource as Condition).idElement.idPart)
                .execute()
        }
    }

    private fun deleteProceduresForEncounter(encounterFhirId: String) {
        @Suppress("UNCHECKED_CAST")
        val bundle = fhirClient.search<Bundle>()
            .forResource("Procedure")
            .where(ReferenceClientParam("encounter").hasId("Encounter/$encounterFhirId"))
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        bundle.entry?.forEach { entry ->
            fhirClient.delete()
                .resourceById("Procedure", (entry.resource as Procedure).idElement.idPart)
                .execute()
        }
    }
}
