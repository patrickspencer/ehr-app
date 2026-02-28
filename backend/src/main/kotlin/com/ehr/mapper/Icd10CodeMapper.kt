package com.ehr.mapper

import com.ehr.dto.Icd10CodeDto
import com.ehr.model.Icd10Code

fun Icd10Code.toDto() = Icd10CodeDto(
    id = id,
    code = code,
    description = description
)
