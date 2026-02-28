package com.ehr.service

import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.EncounterDto
import com.ehr.mapper.toDto
import com.ehr.mapper.toEntity
import com.ehr.repository.CptCodeRepository
import com.ehr.repository.EncounterRepository
import com.ehr.repository.Icd10CodeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class EncounterService(
    private val encounterRepository: EncounterRepository,
    private val icd10CodeRepository: Icd10CodeRepository,
    private val cptCodeRepository: CptCodeRepository
) {

    @Transactional(readOnly = true)
    fun getByPatientId(patientId: Long): List<EncounterDto> {
        return encounterRepository.findByPatientIdOrderByEncounterDateDesc(patientId)
            .map { it.toDto() }
    }

    @Transactional(readOnly = true)
    fun getById(encounterId: Long): EncounterDto {
        val encounter = encounterRepository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        return encounter.toDto()
    }

    @Transactional
    fun create(patientId: Long, request: EncounterCreateRequest): EncounterDto {
        val encounter = request.toEntity(patientId)
        return encounterRepository.save(encounter).toDto()
    }

    @Transactional
    fun update(encounterId: Long, request: EncounterCreateRequest): EncounterDto {
        val encounter = encounterRepository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        encounter.encounterDate = request.encounterDate
        encounter.encounterType = request.encounterType
        encounter.status = request.status
        encounter.provider = request.provider
        encounter.reason = request.reason
        encounter.updatedAt = LocalDateTime.now()
        return encounterRepository.save(encounter).toDto()
    }

    @Transactional
    fun delete(encounterId: Long) {
        if (!encounterRepository.existsById(encounterId)) {
            throw NoSuchElementException("Encounter not found with id: $encounterId")
        }
        encounterRepository.deleteById(encounterId)
    }

    @Transactional
    fun addDiagnosis(encounterId: Long, codeId: Long): EncounterDto {
        val encounter = encounterRepository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        val code = icd10CodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("ICD-10 code not found with id: $codeId") }
        encounter.diagnoses.add(code)
        encounter.updatedAt = LocalDateTime.now()
        return encounterRepository.save(encounter).toDto()
    }

    @Transactional
    fun removeDiagnosis(encounterId: Long, codeId: Long): EncounterDto {
        val encounter = encounterRepository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        encounter.diagnoses.removeIf { it.id == codeId }
        encounter.updatedAt = LocalDateTime.now()
        return encounterRepository.save(encounter).toDto()
    }

    @Transactional
    fun addProcedure(encounterId: Long, codeId: Long): EncounterDto {
        val encounter = encounterRepository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        val code = cptCodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("CPT code not found with id: $codeId") }
        encounter.procedures.add(code)
        encounter.updatedAt = LocalDateTime.now()
        return encounterRepository.save(encounter).toDto()
    }

    @Transactional
    fun removeProcedure(encounterId: Long, codeId: Long): EncounterDto {
        val encounter = encounterRepository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        encounter.procedures.removeIf { it.id == codeId }
        encounter.updatedAt = LocalDateTime.now()
        return encounterRepository.save(encounter).toDto()
    }
}
