package com.ehr.service

import com.ehr.dto.PatientAllergyDto
import com.ehr.dto.PatientAllergyUpsertRequest
import com.ehr.dto.PatientConditionDto
import com.ehr.dto.PatientConditionUpsertRequest
import com.ehr.dto.PatientMedicationDto
import com.ehr.dto.PatientMedicationUpsertRequest
import com.ehr.dto.PatientRiskDto
import com.ehr.mapper.toDto
import com.ehr.model.PatientAllergyEntity
import com.ehr.model.PatientConditionEntity
import com.ehr.model.PatientMedicationEntity
import com.ehr.repository.PatientAllergyRepository
import com.ehr.repository.PatientConditionRepository
import com.ehr.repository.PatientMedicationRepository
import com.ehr.repository.PatientRiskRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class PatientClinicalDataService(
    private val patientService: PatientService,
    private val allergyRepository: PatientAllergyRepository,
    private val conditionRepository: PatientConditionRepository,
    private val medicationRepository: PatientMedicationRepository,
    private val riskRepository: PatientRiskRepository
) {
    fun getAllergies(patientId: Long): List<PatientAllergyDto> {
        patientService.getById(patientId)
        return allergyRepository.findByPatientIdOrderBySortOrderAscIdAsc(patientId).map { it.toDto() }
    }

    fun createAllergy(patientId: Long, request: PatientAllergyUpsertRequest): PatientAllergyDto {
        patientService.getById(patientId)
        val nextOrder = allergyRepository.findByPatientIdOrderBySortOrderAscIdAsc(patientId).size + 1
        val entity = PatientAllergyEntity(
            patientId = patientId,
            allergen = request.allergen.trim(),
            reaction = request.reaction?.trim()?.ifBlank { null },
            severity = request.severity.trim(),
            notedAt = request.notedAt,
            sortOrder = nextOrder
        )
        return allergyRepository.save(entity).toDto()
    }

    fun updateAllergy(patientId: Long, allergyId: Long, request: PatientAllergyUpsertRequest): PatientAllergyDto {
        patientService.getById(patientId)
        val entity = requireAllergy(patientId, allergyId)
        entity.allergen = request.allergen.trim()
        entity.reaction = request.reaction?.trim()?.ifBlank { null }
        entity.severity = request.severity.trim()
        entity.notedAt = request.notedAt
        entity.updatedAt = LocalDateTime.now()
        return allergyRepository.save(entity).toDto()
    }

    fun deleteAllergy(patientId: Long, allergyId: Long) {
        patientService.getById(patientId)
        allergyRepository.delete(requireAllergy(patientId, allergyId))
    }

    fun getConditions(patientId: Long): List<PatientConditionDto> {
        patientService.getById(patientId)
        return conditionRepository.findByPatientIdOrderBySortOrderAscIdAsc(patientId).map { it.toDto() }
    }

    fun createCondition(patientId: Long, request: PatientConditionUpsertRequest): PatientConditionDto {
        patientService.getById(patientId)
        val nextOrder = conditionRepository.findByPatientIdOrderBySortOrderAscIdAsc(patientId).size + 1
        val entity = PatientConditionEntity(
            patientId = patientId,
            conditionName = request.conditionName.trim(),
            icd10Code = request.icd10Code?.trim()?.ifBlank { null },
            status = request.status.trim(),
            diagnosedAt = request.diagnosedAt,
            notes = request.notes?.trim()?.ifBlank { null },
            sortOrder = nextOrder
        )
        return conditionRepository.save(entity).toDto()
    }

    fun updateCondition(patientId: Long, conditionId: Long, request: PatientConditionUpsertRequest): PatientConditionDto {
        patientService.getById(patientId)
        val entity = requireCondition(patientId, conditionId)
        entity.conditionName = request.conditionName.trim()
        entity.icd10Code = request.icd10Code?.trim()?.ifBlank { null }
        entity.status = request.status.trim()
        entity.diagnosedAt = request.diagnosedAt
        entity.notes = request.notes?.trim()?.ifBlank { null }
        entity.updatedAt = LocalDateTime.now()
        return conditionRepository.save(entity).toDto()
    }

    fun deleteCondition(patientId: Long, conditionId: Long) {
        patientService.getById(patientId)
        conditionRepository.delete(requireCondition(patientId, conditionId))
    }

    fun getMedications(patientId: Long): List<PatientMedicationDto> {
        patientService.getById(patientId)
        return medicationRepository.findByPatientIdOrderBySortOrderAscIdAsc(patientId).map { it.toDto() }
    }

    fun createMedication(patientId: Long, request: PatientMedicationUpsertRequest): PatientMedicationDto {
        patientService.getById(patientId)
        val nextOrder = medicationRepository.findByPatientIdOrderBySortOrderAscIdAsc(patientId).size + 1
        val entity = PatientMedicationEntity(
            patientId = patientId,
            medicationName = request.medicationName.trim(),
            dose = request.dose?.trim()?.ifBlank { null },
            route = request.route?.trim()?.ifBlank { null },
            frequency = request.frequency?.trim()?.ifBlank { null },
            status = request.status.trim(),
            startedAt = request.startedAt,
            instructions = request.instructions?.trim()?.ifBlank { null },
            sortOrder = nextOrder
        )
        return medicationRepository.save(entity).toDto()
    }

    fun updateMedication(patientId: Long, medicationId: Long, request: PatientMedicationUpsertRequest): PatientMedicationDto {
        patientService.getById(patientId)
        val entity = requireMedication(patientId, medicationId)
        entity.medicationName = request.medicationName.trim()
        entity.dose = request.dose?.trim()?.ifBlank { null }
        entity.route = request.route?.trim()?.ifBlank { null }
        entity.frequency = request.frequency?.trim()?.ifBlank { null }
        entity.status = request.status.trim()
        entity.startedAt = request.startedAt
        entity.instructions = request.instructions?.trim()?.ifBlank { null }
        entity.updatedAt = LocalDateTime.now()
        return medicationRepository.save(entity).toDto()
    }

    fun deleteMedication(patientId: Long, medicationId: Long) {
        patientService.getById(patientId)
        medicationRepository.delete(requireMedication(patientId, medicationId))
    }

    fun getRisks(patientId: Long): List<PatientRiskDto> {
        patientService.getById(patientId)
        return riskRepository.findByPatientIdOrderBySortOrderAscIdAsc(patientId).map { it.toDto() }
    }

    private fun requireAllergy(patientId: Long, allergyId: Long): PatientAllergyEntity {
        val entity = allergyRepository.findById(allergyId)
            .orElseThrow { NoSuchElementException("Allergy not found with id: $allergyId") }
        if (entity.patientId != patientId) {
            throw NoSuchElementException("Allergy not found for patient id: $patientId")
        }
        return entity
    }

    private fun requireCondition(patientId: Long, conditionId: Long): PatientConditionEntity {
        val entity = conditionRepository.findById(conditionId)
            .orElseThrow { NoSuchElementException("Condition not found with id: $conditionId") }
        if (entity.patientId != patientId) {
            throw NoSuchElementException("Condition not found for patient id: $patientId")
        }
        return entity
    }

    private fun requireMedication(patientId: Long, medicationId: Long): PatientMedicationEntity {
        val entity = medicationRepository.findById(medicationId)
            .orElseThrow { NoSuchElementException("Medication not found with id: $medicationId") }
        if (entity.patientId != patientId) {
            throw NoSuchElementException("Medication not found for patient id: $patientId")
        }
        return entity
    }
}
