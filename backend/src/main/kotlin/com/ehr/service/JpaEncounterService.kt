package com.ehr.service

import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.EncounterDto
import com.ehr.mapper.toDto
import com.ehr.model.EncounterEntity
import com.ehr.repository.CptCodeRepository
import com.ehr.repository.EncounterEntityRepository
import com.ehr.repository.Icd10CodeRepository
import com.ehr.repository.PatientEntityRepository
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
@Profile("!fhir")
class JpaEncounterService(
    private val repository: EncounterEntityRepository,
    private val patientRepository: PatientEntityRepository,
    private val icd10CodeRepository: Icd10CodeRepository,
    private val cptCodeRepository: CptCodeRepository
) : EncounterService {

    override fun getByPatientId(patientId: Long): List<EncounterDto> {
        return repository.findByPatientIdOrderByEncounterDateDesc(patientId)
            .map { it.toDto() }
    }

    override fun getById(encounterId: Long): EncounterDto {
        val entity = repository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        return entity.toDto()
    }

    override fun create(patientId: Long, request: EncounterCreateRequest): EncounterDto {
        if (!patientRepository.existsById(patientId)) {
            throw NoSuchElementException("Patient not found with id: $patientId")
        }
        val entity = EncounterEntity(
            patientId = patientId,
            encounterDate = request.encounterDate,
            encounterType = request.encounterType,
            status = request.status,
            provider = request.provider,
            reason = request.reason
        )
        return repository.save(entity).toDto()
    }

    override fun update(encounterId: Long, request: EncounterCreateRequest): EncounterDto {
        val entity = repository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        entity.encounterDate = request.encounterDate
        entity.encounterType = request.encounterType
        entity.status = request.status
        entity.provider = request.provider
        entity.reason = request.reason
        entity.updatedAt = LocalDateTime.now()
        return repository.save(entity).toDto()
    }

    override fun delete(encounterId: Long) {
        if (!repository.existsById(encounterId)) {
            throw NoSuchElementException("Encounter not found with id: $encounterId")
        }
        repository.deleteById(encounterId)
    }

    override fun addDiagnosis(encounterId: Long, codeId: Long): EncounterDto {
        val entity = repository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        val icd10Code = icd10CodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("ICD-10 code not found with id: $codeId") }
        entity.diagnoses.add(icd10Code)
        entity.updatedAt = LocalDateTime.now()
        return repository.save(entity).toDto()
    }

    override fun removeDiagnosis(encounterId: Long, codeId: Long): EncounterDto {
        val entity = repository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        val icd10Code = icd10CodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("ICD-10 code not found with id: $codeId") }
        entity.diagnoses.remove(icd10Code)
        entity.updatedAt = LocalDateTime.now()
        return repository.save(entity).toDto()
    }

    override fun addProcedure(encounterId: Long, codeId: Long): EncounterDto {
        val entity = repository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        val cptCode = cptCodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("CPT code not found with id: $codeId") }
        entity.procedures.add(cptCode)
        entity.updatedAt = LocalDateTime.now()
        return repository.save(entity).toDto()
    }

    override fun removeProcedure(encounterId: Long, codeId: Long): EncounterDto {
        val entity = repository.findById(encounterId)
            .orElseThrow { NoSuchElementException("Encounter not found with id: $encounterId") }
        val cptCode = cptCodeRepository.findById(codeId)
            .orElseThrow { NoSuchElementException("CPT code not found with id: $codeId") }
        entity.procedures.remove(cptCode)
        entity.updatedAt = LocalDateTime.now()
        return repository.save(entity).toDto()
    }
}
