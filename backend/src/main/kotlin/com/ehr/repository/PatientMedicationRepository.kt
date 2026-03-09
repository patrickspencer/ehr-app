package com.ehr.repository

import com.ehr.model.PatientMedicationEntity
import org.springframework.data.jpa.repository.JpaRepository

interface PatientMedicationRepository : JpaRepository<PatientMedicationEntity, Long> {
    fun findByPatientIdOrderBySortOrderAscIdAsc(patientId: Long): List<PatientMedicationEntity>
}
