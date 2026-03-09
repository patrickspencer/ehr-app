package com.ehr.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class PatientConditionDto(
    val id: Long,
    val patientId: Long,
    val conditionName: String,
    val icd10Code: String?,
    val status: String,
    val diagnosedAt: LocalDate?,
    val notes: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
