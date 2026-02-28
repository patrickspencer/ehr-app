package com.ehr.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class EncounterDto(
    val id: Long,
    val patientId: Long,
    val encounterDate: LocalDate,
    val encounterType: String,
    val status: String,
    val provider: String,
    val reason: String?,
    val diagnoses: List<Icd10CodeDto>,
    val procedures: List<CptCodeDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class EncounterCreateRequest(
    val encounterDate: LocalDate,
    val encounterType: String,
    val status: String = "PLANNED",
    val provider: String,
    val reason: String?
)
