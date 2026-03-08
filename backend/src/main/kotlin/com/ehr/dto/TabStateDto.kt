package com.ehr.dto

import java.time.LocalDateTime

data class TabStateDto(
    val userId: Long,
    val tabState: String,
    val updatedAt: LocalDateTime
)

data class TabStateSaveRequest(
    val tabState: String
)
