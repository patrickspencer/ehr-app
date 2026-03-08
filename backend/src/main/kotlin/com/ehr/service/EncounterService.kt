package com.ehr.service

import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.EncounterDto

interface EncounterService {
    fun getByPatientId(patientId: Long): List<EncounterDto>
    fun getById(encounterId: Long): EncounterDto
    fun create(patientId: Long, request: EncounterCreateRequest): EncounterDto
    fun update(encounterId: Long, request: EncounterCreateRequest): EncounterDto
    fun delete(encounterId: Long)
    fun addDiagnosis(encounterId: Long, codeId: Long): EncounterDto
    fun removeDiagnosis(encounterId: Long, codeId: Long): EncounterDto
    fun addProcedure(encounterId: Long, codeId: Long): EncounterDto
    fun removeProcedure(encounterId: Long, codeId: Long): EncounterDto
}
