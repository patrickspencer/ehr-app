package com.ehr.repository

import com.ehr.model.PatientAllergyEntity
import org.springframework.data.jpa.repository.JpaRepository

interface PatientAllergyRepository : JpaRepository<PatientAllergyEntity, Long> {
    fun findByPatientIdOrderBySortOrderAscIdAsc(patientId: Long): List<PatientAllergyEntity>
}
