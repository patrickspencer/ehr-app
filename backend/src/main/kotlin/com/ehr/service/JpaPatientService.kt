package com.ehr.service

import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import com.ehr.mapper.toDto
import com.ehr.model.PatientEntity
import com.ehr.repository.PatientEntityRepository
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
@Profile("!fhir")
class JpaPatientService(
    private val repository: PatientEntityRepository
) : PatientService {

    override fun findAll(query: String?): List<PatientDto> {
        val entities = if (query.isNullOrBlank()) {
            repository.findAll()
        } else {
            repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query)
        }
        return entities.map { it.toDto() }
    }

    override fun getById(id: Long): PatientDto {
        val entity = repository.findById(id)
            .orElseThrow { NoSuchElementException("Patient not found with id: $id") }
        return entity.toDto()
    }

    override fun create(request: PatientCreateRequest): PatientDto {
        val entity = PatientEntity(
            firstName = request.firstName,
            lastName = request.lastName,
            dateOfBirth = request.dateOfBirth,
            gender = request.gender,
            phone = request.phone,
            email = request.email,
            address = request.address
        )
        return repository.save(entity).toDto()
    }

    override fun update(id: Long, request: PatientCreateRequest): PatientDto {
        val entity = repository.findById(id)
            .orElseThrow { NoSuchElementException("Patient not found with id: $id") }
        entity.firstName = request.firstName
        entity.lastName = request.lastName
        entity.dateOfBirth = request.dateOfBirth
        entity.gender = request.gender
        entity.phone = request.phone
        entity.email = request.email
        entity.address = request.address
        entity.updatedAt = LocalDateTime.now()
        return repository.save(entity).toDto()
    }

    override fun delete(id: Long) {
        if (!repository.existsById(id)) {
            throw NoSuchElementException("Patient not found with id: $id")
        }
        repository.deleteById(id)
    }
}
