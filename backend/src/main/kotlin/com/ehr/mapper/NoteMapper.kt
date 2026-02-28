package com.ehr.mapper

import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto
import com.ehr.model.Note
import com.ehr.model.Patient

fun Note.toDto() = NoteDto(
    id = id,
    patientId = patient.id,
    encounterId = encounter?.id,
    content = content,
    author = author,
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun NoteCreateRequest.toEntity(patientId: Long) = Note(
    patient = Patient().apply { id = patientId },
    content = content,
    author = author
)
