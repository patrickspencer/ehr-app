package com.ehr.mapper

import com.ehr.dto.EncounterDto
import com.ehr.model.EncounterEntity

fun EncounterEntity.toDto() = EncounterDto(
    id = id,
    patientId = patientId,
    encounterDate = encounterDate,
    encounterType = encounterType,
    status = status,
    provider = provider,
    reason = reason,
    diagnoses = diagnoses.map { it.toDto() },
    procedures = procedures.map { it.toDto() },
    createdAt = createdAt,
    updatedAt = updatedAt
)
