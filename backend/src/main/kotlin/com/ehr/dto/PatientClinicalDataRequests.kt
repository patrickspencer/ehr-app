package com.ehr.dto

import java.time.LocalDate

data class PatientAllergyUpsertRequest(
    val allergen: String,
    val reaction: String?,
    val severity: String,
    val notedAt: LocalDate?
)

data class PatientConditionUpsertRequest(
    val conditionName: String,
    val icd10Code: String?,
    val status: String,
    val diagnosedAt: LocalDate?,
    val notes: String?
)

data class PatientMedicationUpsertRequest(
    val medicationName: String,
    val dose: String?,
    val route: String?,
    val frequency: String?,
    val status: String,
    val startedAt: LocalDate?,
    val instructions: String?
)
