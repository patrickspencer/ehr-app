package com.ehr.dto

import java.time.LocalDateTime

data class NoteDto(
    val id: Long,
    val patientId: Long,
    val encounterId: Long?,
    val content: String,
    val author: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class NoteCreateRequest(
    val content: String,
    val author: String
)
