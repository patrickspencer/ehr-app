package com.ehr.service

import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto

interface PatientService {
    fun findAll(query: String?): List<PatientDto>
    fun getById(id: Long): PatientDto
    fun create(request: PatientCreateRequest): PatientDto
    fun update(id: Long, request: PatientCreateRequest): PatientDto
    fun delete(id: Long)
}
