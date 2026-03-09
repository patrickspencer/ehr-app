package com.ehr.controller

import com.ehr.dto.PatientAllergyDto
import com.ehr.dto.PatientAllergyUpsertRequest
import com.ehr.dto.PatientConditionDto
import com.ehr.dto.PatientConditionUpsertRequest
import com.ehr.dto.PatientMedicationDto
import com.ehr.dto.PatientMedicationUpsertRequest
import com.ehr.dto.PatientRiskDto
import com.ehr.service.PatientClinicalDataService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/patients/{patientId}")
class PatientClinicalDataController(
    private val patientClinicalDataService: PatientClinicalDataService
) {
    @GetMapping("/allergies")
    fun getAllergies(@PathVariable patientId: Long): List<PatientAllergyDto> {
        return patientClinicalDataService.getAllergies(patientId)
    }

    @PostMapping("/allergies")
    @ResponseStatus(HttpStatus.CREATED)
    fun createAllergy(
        @PathVariable patientId: Long,
        @RequestBody request: PatientAllergyUpsertRequest
    ): PatientAllergyDto {
        return patientClinicalDataService.createAllergy(patientId, request)
    }

    @PutMapping("/allergies/{allergyId}")
    fun updateAllergy(
        @PathVariable patientId: Long,
        @PathVariable allergyId: Long,
        @RequestBody request: PatientAllergyUpsertRequest
    ): PatientAllergyDto {
        return patientClinicalDataService.updateAllergy(patientId, allergyId, request)
    }

    @DeleteMapping("/allergies/{allergyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteAllergy(@PathVariable patientId: Long, @PathVariable allergyId: Long) {
        patientClinicalDataService.deleteAllergy(patientId, allergyId)
    }

    @GetMapping("/conditions")
    fun getConditions(@PathVariable patientId: Long): List<PatientConditionDto> {
        return patientClinicalDataService.getConditions(patientId)
    }

    @PostMapping("/conditions")
    @ResponseStatus(HttpStatus.CREATED)
    fun createCondition(
        @PathVariable patientId: Long,
        @RequestBody request: PatientConditionUpsertRequest
    ): PatientConditionDto {
        return patientClinicalDataService.createCondition(patientId, request)
    }

    @PutMapping("/conditions/{conditionId}")
    fun updateCondition(
        @PathVariable patientId: Long,
        @PathVariable conditionId: Long,
        @RequestBody request: PatientConditionUpsertRequest
    ): PatientConditionDto {
        return patientClinicalDataService.updateCondition(patientId, conditionId, request)
    }

    @DeleteMapping("/conditions/{conditionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteCondition(@PathVariable patientId: Long, @PathVariable conditionId: Long) {
        patientClinicalDataService.deleteCondition(patientId, conditionId)
    }

    @GetMapping("/medications")
    fun getMedications(@PathVariable patientId: Long): List<PatientMedicationDto> {
        return patientClinicalDataService.getMedications(patientId)
    }

    @PostMapping("/medications")
    @ResponseStatus(HttpStatus.CREATED)
    fun createMedication(
        @PathVariable patientId: Long,
        @RequestBody request: PatientMedicationUpsertRequest
    ): PatientMedicationDto {
        return patientClinicalDataService.createMedication(patientId, request)
    }

    @PutMapping("/medications/{medicationId}")
    fun updateMedication(
        @PathVariable patientId: Long,
        @PathVariable medicationId: Long,
        @RequestBody request: PatientMedicationUpsertRequest
    ): PatientMedicationDto {
        return patientClinicalDataService.updateMedication(patientId, medicationId, request)
    }

    @DeleteMapping("/medications/{medicationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteMedication(@PathVariable patientId: Long, @PathVariable medicationId: Long) {
        patientClinicalDataService.deleteMedication(patientId, medicationId)
    }

    @GetMapping("/risks")
    fun getRisks(@PathVariable patientId: Long): List<PatientRiskDto> {
        return patientClinicalDataService.getRisks(patientId)
    }
}
