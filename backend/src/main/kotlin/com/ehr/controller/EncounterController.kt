package com.ehr.controller

import com.ehr.dto.CodeAssignRequest
import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.EncounterDto
import com.ehr.service.EncounterService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/patients/{patientId}/encounters")
class EncounterController(private val encounterService: EncounterService) {

    @GetMapping
    fun getByPatientId(@PathVariable patientId: Long): List<EncounterDto> {
        return encounterService.getByPatientId(patientId)
    }

    @GetMapping("/{encounterId}")
    fun getById(@PathVariable encounterId: Long): EncounterDto {
        return encounterService.getById(encounterId)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@PathVariable patientId: Long, @RequestBody request: EncounterCreateRequest): EncounterDto {
        return encounterService.create(patientId, request)
    }

    @PutMapping("/{encounterId}")
    fun update(@PathVariable encounterId: Long, @RequestBody request: EncounterCreateRequest): EncounterDto {
        return encounterService.update(encounterId, request)
    }

    @DeleteMapping("/{encounterId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable encounterId: Long) {
        encounterService.delete(encounterId)
    }

    @PostMapping("/{encounterId}/diagnoses")
    fun addDiagnosis(@PathVariable encounterId: Long, @RequestBody request: CodeAssignRequest): EncounterDto {
        return encounterService.addDiagnosis(encounterId, request.codeId)
    }

    @DeleteMapping("/{encounterId}/diagnoses/{codeId}")
    fun removeDiagnosis(@PathVariable encounterId: Long, @PathVariable codeId: Long): EncounterDto {
        return encounterService.removeDiagnosis(encounterId, codeId)
    }

    @PostMapping("/{encounterId}/procedures")
    fun addProcedure(@PathVariable encounterId: Long, @RequestBody request: CodeAssignRequest): EncounterDto {
        return encounterService.addProcedure(encounterId, request.codeId)
    }

    @DeleteMapping("/{encounterId}/procedures/{codeId}")
    fun removeProcedure(@PathVariable encounterId: Long, @PathVariable codeId: Long): EncounterDto {
        return encounterService.removeProcedure(encounterId, codeId)
    }
}
