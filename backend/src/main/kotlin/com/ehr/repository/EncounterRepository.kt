package com.ehr.repository

import com.ehr.model.Encounter
import org.springframework.data.jpa.repository.JpaRepository

interface EncounterRepository : JpaRepository<Encounter, Long> {

    fun findByPatientIdOrderByEncounterDateDesc(patientId: Long): List<Encounter>
}
