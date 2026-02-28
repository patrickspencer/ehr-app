package com.ehr.controller

import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import com.ehr.service.PatientService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/patients")
class PatientController(private val patientService: PatientService) {

    @GetMapping("/count")
    fun count(): Map<String, Long> {
        return mapOf("count" to patientService.findAll(null).size.toLong())
    }

    @GetMapping
    fun list(@RequestParam(required = false) q: String?): List<PatientDto> {
        return patientService.findAll(q)
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): PatientDto {
        return patientService.getById(id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody request: PatientCreateRequest): PatientDto {
        return patientService.create(request)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: PatientCreateRequest): PatientDto {
        return patientService.update(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        patientService.delete(id)
    }
}
