package com.ehr.mapper

import com.ehr.dto.PatientAllergyDto
import com.ehr.dto.PatientConditionDto
import com.ehr.dto.PatientMedicationDto
import com.ehr.dto.PatientRiskDto
import com.ehr.model.PatientAllergyEntity
import com.ehr.model.PatientConditionEntity
import com.ehr.model.PatientMedicationEntity
import com.ehr.model.PatientRiskEntity

fun PatientAllergyEntity.toDto() = PatientAllergyDto(
    id = id,
    patientId = patientId,
    allergen = allergen,
    reaction = reaction,
    severity = severity,
    notedAt = notedAt,
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun PatientConditionEntity.toDto() = PatientConditionDto(
    id = id,
    patientId = patientId,
    conditionName = conditionName,
    icd10Code = icd10Code,
    status = status,
    diagnosedAt = diagnosedAt,
    notes = notes,
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun PatientMedicationEntity.toDto() = PatientMedicationDto(
    id = id,
    patientId = patientId,
    medicationName = medicationName,
    dose = dose,
    route = route,
    frequency = frequency,
    status = status,
    startedAt = startedAt,
    instructions = instructions,
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun PatientRiskEntity.toDto() = PatientRiskDto(
    id = id,
    patientId = patientId,
    riskName = riskName,
    level = level,
    details = details,
    createdAt = createdAt,
    updatedAt = updatedAt
)
