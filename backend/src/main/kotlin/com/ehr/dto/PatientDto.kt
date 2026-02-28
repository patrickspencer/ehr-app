package com.ehr.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class PatientDto(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val dateOfBirth: LocalDate,
    val gender: String?,
    val phone: String?,
    val email: String?,
    val address: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class PatientCreateRequest(
    val firstName: String,
    val lastName: String,
    val dateOfBirth: LocalDate,
    val gender: String?,
    val phone: String?,
    val email: String?,
    val address: String?
)
