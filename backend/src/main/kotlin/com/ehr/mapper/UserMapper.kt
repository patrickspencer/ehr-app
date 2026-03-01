package com.ehr.mapper

import com.ehr.dto.UserDto
import com.ehr.model.User

fun User.toDto() = UserDto(
    id = id,
    firstName = firstName,
    lastName = lastName,
    role = role,
    title = title,
    email = email,
    createdAt = createdAt,
    updatedAt = updatedAt
)
