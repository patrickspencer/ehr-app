package com.ehr.repository

import com.ehr.model.Note
import org.springframework.data.jpa.repository.JpaRepository

interface NoteRepository : JpaRepository<Note, Long> {

    fun findByPatientIdOrderByCreatedAtDesc(patientId: Long): List<Note>

    fun findByEncounterIdOrderByCreatedAtDesc(encounterId: Long): List<Note>
}
