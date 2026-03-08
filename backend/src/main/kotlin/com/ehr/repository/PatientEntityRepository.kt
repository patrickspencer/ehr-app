package com.ehr.repository

import com.ehr.model.PatientEntity
import org.springframework.data.jpa.repository.JpaRepository

interface PatientEntityRepository : JpaRepository<PatientEntity, Long> {
    fun findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        firstName: String,
        lastName: String
    ): List<PatientEntity>
}
