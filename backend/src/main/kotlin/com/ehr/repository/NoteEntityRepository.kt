package com.ehr.repository

import com.ehr.model.NoteEntity
import org.springframework.data.jpa.repository.JpaRepository

interface NoteEntityRepository : JpaRepository<NoteEntity, Long> {
    fun findByPatientIdOrderByUpdatedAtDesc(patientId: Long): List<NoteEntity>
}
