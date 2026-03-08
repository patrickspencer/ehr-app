package com.ehr.service

import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto

interface NoteService {
    fun getByPatientId(patientId: Long): List<NoteDto>
    fun create(patientId: Long, request: NoteCreateRequest): NoteDto
    fun update(noteId: Long, request: NoteCreateRequest): NoteDto
    fun delete(noteId: Long)
}
