package com.ehr.mapper

import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.EncounterDto
import com.ehr.model.Encounter
import com.ehr.model.Patient

fun Encounter.toDto() = EncounterDto(
    id = id,
    patientId = patient.id,
    encounterDate = encounterDate,
    encounterType = encounterType,
    status = status,
    provider = provider,
    reason = reason,
    diagnoses = diagnoses.map { it.toDto() }.sortedBy { it.code },
    procedures = procedures.map { it.toDto() }.sortedBy { it.code },
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun EncounterCreateRequest.toEntity(patientId: Long) = Encounter(
    patient = Patient().apply { id = patientId },
    encounterDate = encounterDate,
    encounterType = encounterType,
    status = status,
    provider = provider,
    reason = reason
)
