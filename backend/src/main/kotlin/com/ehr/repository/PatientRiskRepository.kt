package com.ehr.repository

import com.ehr.model.PatientRiskEntity
import org.springframework.data.jpa.repository.JpaRepository

interface PatientRiskRepository : JpaRepository<PatientRiskEntity, Long> {
    fun findByPatientIdOrderBySortOrderAscIdAsc(patientId: Long): List<PatientRiskEntity>
}
