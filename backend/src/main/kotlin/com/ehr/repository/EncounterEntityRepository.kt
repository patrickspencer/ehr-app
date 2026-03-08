package com.ehr.repository

import com.ehr.model.EncounterEntity
import org.springframework.data.jpa.repository.JpaRepository

interface EncounterEntityRepository : JpaRepository<EncounterEntity, Long> {
    fun findByPatientIdOrderByEncounterDateDesc(patientId: Long): List<EncounterEntity>
}
