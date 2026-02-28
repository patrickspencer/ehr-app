package com.ehr.mapper

import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import com.ehr.model.Patient

fun Patient.toDto() = PatientDto(
    id = id,
    firstName = firstName,
    lastName = lastName,
    dateOfBirth = dateOfBirth,
    gender = gender,
    phone = phone,
    email = email,
    address = address,
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun PatientCreateRequest.toEntity() = Patient(
    firstName = firstName,
    lastName = lastName,
    dateOfBirth = dateOfBirth,
    gender = gender,
    phone = phone,
    email = email,
    address = address
)
