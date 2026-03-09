package com.ehr.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class PatientAllergyDto(
    val id: Long,
    val patientId: Long,
    val allergen: String,
    val reaction: String?,
    val severity: String,
    val notedAt: LocalDate?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
