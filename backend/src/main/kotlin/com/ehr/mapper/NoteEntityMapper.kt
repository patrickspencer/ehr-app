package com.ehr.mapper

import com.ehr.dto.NoteDto
import com.ehr.model.NoteEntity

fun NoteEntity.toDto() = NoteDto(
    id = id,
    patientId = patientId,
    encounterId = encounterId,
    content = content,
    author = author,
    createdAt = createdAt,
    updatedAt = updatedAt
)
