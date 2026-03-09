package com.ehr.dto

import java.time.LocalDateTime

data class PatientRiskDto(
    val id: Long,
    val patientId: Long,
    val riskName: String,
    val level: String,
    val details: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
