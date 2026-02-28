package com.ehr.service

import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import com.ehr.mapper.toDto
import com.ehr.mapper.toEntity
import com.ehr.repository.PatientRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class PatientService(private val patientRepository: PatientRepository) {

    fun findAll(query: String?): List<PatientDto> {
        val patients = if (query.isNullOrBlank()) {
            patientRepository.findAll()
        } else {
            patientRepository.search(query)
        }
        return patients.map { it.toDto() }
    }

    fun getById(id: Long): PatientDto {
        val patient = patientRepository.findById(id)
            .orElseThrow { NoSuchElementException("Patient not found with id: $id") }
        return patient.toDto()
    }

    fun create(request: PatientCreateRequest): PatientDto {
        val patient = request.toEntity()
        return patientRepository.save(patient).toDto()
    }

    fun update(id: Long, request: PatientCreateRequest): PatientDto {
        val patient = patientRepository.findById(id)
            .orElseThrow { NoSuchElementException("Patient not found with id: $id") }
        patient.firstName = request.firstName
        patient.lastName = request.lastName
        patient.dateOfBirth = request.dateOfBirth
        patient.gender = request.gender
        patient.phone = request.phone
        patient.email = request.email
        patient.address = request.address
        patient.updatedAt = LocalDateTime.now()
        return patientRepository.save(patient).toDto()
    }

    fun delete(id: Long) {
        if (!patientRepository.existsById(id)) {
            throw NoSuchElementException("Patient not found with id: $id")
        }
        patientRepository.deleteById(id)
    }
}
