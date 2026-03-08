package com.ehr.mapper

import com.ehr.dto.PatientDto
import com.ehr.model.PatientEntity

fun PatientEntity.toDto() = PatientDto(
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
