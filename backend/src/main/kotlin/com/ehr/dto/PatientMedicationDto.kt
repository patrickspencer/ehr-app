package com.ehr.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class PatientMedicationDto(
    val id: Long,
    val patientId: Long,
    val medicationName: String,
    val dose: String?,
    val route: String?,
    val frequency: String?,
    val status: String,
    val startedAt: LocalDate?,
    val instructions: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
