package com.ehr.repository

import com.ehr.model.PatientConditionEntity
import org.springframework.data.jpa.repository.JpaRepository

interface PatientConditionRepository : JpaRepository<PatientConditionEntity, Long> {
    fun findByPatientIdOrderBySortOrderAscIdAsc(patientId: Long): List<PatientConditionEntity>
}
