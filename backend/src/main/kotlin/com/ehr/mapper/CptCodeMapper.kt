package com.ehr.mapper

import com.ehr.dto.CptCodeDto
import com.ehr.model.CptCode

fun CptCode.toDto() = CptCodeDto(
    id = id,
    code = code,
    description = description
)
