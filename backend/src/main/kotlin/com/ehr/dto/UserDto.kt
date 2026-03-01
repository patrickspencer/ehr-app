package com.ehr.dto

import java.time.LocalDateTime

data class UserDto(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val role: String,
    val title: String?,
    val email: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
