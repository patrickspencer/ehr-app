package com.ehr

import com.ehr.dto.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import java.time.LocalDate

class EncounterApiTest : BaseIntegrationTest() {

    companion object {
        var patientId: Long = 0
        var createdEncounterId: Long = 0
        var addedDiagnosisCodeId: Long = 0
        var addedProcedureCodeId: Long = 0
    }

    private fun findPatientWithEncounters(): Long {
        val patients = rest.exchange(
            "/api/patients",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientDto>>() {}
        ).body!!

        for (patient in patients) {
            val encounters = rest.exchange(
                "/api/patients/${patient.id}/encounters",
                HttpMethod.GET,
                null,
                object : ParameterizedTypeReference<List<EncounterDto>>() {}
            ).body!!
            if (encounters.isNotEmpty()) {
                patientId = patient.id
                return patient.id
            }
        }
        return fail("No patient with encounters found")
    }

    @Test
    @Order(1)
    fun `list encounters for patient`() {
        val pid = findPatientWithEncounters()
        val response = rest.exchange(
            "/api/patients/$pid/encounters",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<EncounterDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val encounters = response.body!!
        assertTrue(encounters.isNotEmpty(), "Expected encounters for patient $pid")
        encounters.forEach { assertEquals(pid, it.patientId) }
    }

    @Test
    @Order(2)
    fun `get single encounter`() {
        val encounters = rest.exchange(
            "/api/patients/$patientId/encounters",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<EncounterDto>>() {}
        ).body!!

        val enc = encounters.first()
        val response = rest.getForEntity(
            "/api/patients/$patientId/encounters/${enc.id}",
            EncounterDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val encounter = response.body!!
        assertEquals(enc.id, encounter.id)
        assertEquals(patientId, encounter.patientId)
        assertNotNull(encounter.diagnoses)
        assertNotNull(encounter.procedures)
    }

    @Test
    @Order(3)
    fun `create encounter`() {
        val request = EncounterCreateRequest(
            encounterDate = LocalDate.now(),
            encounterType = "OFFICE_VISIT",
            status = "PLANNED",
            provider = "Dr. Test Provider",
            reason = "Integration test visit"
        )
        val response = rest.postForEntity(
            "/api/patients/$patientId/encounters",
            request,
            EncounterDto::class.java
        )
        assertEquals(HttpStatus.CREATED, response.statusCode)
        val encounter = response.body!!
        assertTrue(encounter.id > 0)
        assertEquals(patientId, encounter.patientId)
        assertEquals("OFFICE_VISIT", encounter.encounterType)
        assertEquals("PLANNED", encounter.status)
        assertEquals("Dr. Test Provider", encounter.provider)
        assertEquals("Integration test visit", encounter.reason)
        createdEncounterId = encounter.id
    }

    @Test
    @Order(4)
    fun `update encounter`() {
        val request = EncounterCreateRequest(
            encounterDate = LocalDate.now(),
            encounterType = "FOLLOW_UP",
            status = "COMPLETED",
            provider = "Dr. Updated Provider",
            reason = "Updated reason"
        )
        val response = rest.exchange(
            "/api/patients/$patientId/encounters/$createdEncounterId",
            HttpMethod.PUT,
            HttpEntity(request),
            EncounterDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val encounter = response.body!!
        assertEquals(createdEncounterId, encounter.id)
        assertEquals("FOLLOW_UP", encounter.encounterType)
        assertEquals("COMPLETED", encounter.status)
        assertEquals("Dr. Updated Provider", encounter.provider)
        assertEquals("Updated reason", encounter.reason)
    }

    @Test
    @Order(5)
    fun `add diagnosis to encounter`() {
        val icd10Codes = rest.exchange(
            "/api/icd10-codes?q=diabetes",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<Icd10CodeDto>>() {}
        ).body!!
        assertTrue(icd10Codes.isNotEmpty(), "Expected ICD-10 codes matching 'diabetes'")

        val codeId = icd10Codes.first().id
        addedDiagnosisCodeId = codeId
        val request = CodeAssignRequest(codeId = codeId)
        val response = rest.postForEntity(
            "/api/patients/$patientId/encounters/$createdEncounterId/diagnoses",
            request,
            EncounterDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val encounter = response.body!!
        assertTrue(
            encounter.diagnoses.any { it.id == codeId },
            "Expected diagnosis with code id $codeId in encounter"
        )
    }

    @Test
    @Order(6)
    fun `remove diagnosis from encounter`() {
        // Use the codeId saved from the add test — don't re-fetch the encounter
        // because FHIR search indexing may have a delay
        assertTrue(addedDiagnosisCodeId > 0, "Diagnosis code ID should have been set by add test")

        val response = rest.exchange(
            "/api/patients/$patientId/encounters/$createdEncounterId/diagnoses/$addedDiagnosisCodeId",
            HttpMethod.DELETE,
            null,
            EncounterDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val updated = response.body!!
        assertFalse(
            updated.diagnoses.any { it.id == addedDiagnosisCodeId },
            "Expected diagnosis $addedDiagnosisCodeId to be removed"
        )
    }

    @Test
    @Order(7)
    fun `add procedure to encounter`() {
        val cptCodes = rest.exchange(
            "/api/cpt-codes?q=office",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<CptCodeDto>>() {}
        ).body!!
        assertTrue(cptCodes.isNotEmpty(), "Expected CPT codes matching 'office'")

        val codeId = cptCodes.first().id
        addedProcedureCodeId = codeId
        val request = CodeAssignRequest(codeId = codeId)
        val response = rest.postForEntity(
            "/api/patients/$patientId/encounters/$createdEncounterId/procedures",
            request,
            EncounterDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val encounter = response.body!!
        assertTrue(
            encounter.procedures.any { it.id == codeId },
            "Expected procedure with code id $codeId in encounter"
        )
    }

    @Test
    @Order(8)
    fun `remove procedure from encounter`() {
        assertTrue(addedProcedureCodeId > 0, "Procedure code ID should have been set by add test")

        val response = rest.exchange(
            "/api/patients/$patientId/encounters/$createdEncounterId/procedures/$addedProcedureCodeId",
            HttpMethod.DELETE,
            null,
            EncounterDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val updated = response.body!!
        assertFalse(
            updated.procedures.any { it.id == addedProcedureCodeId },
            "Expected procedure $addedProcedureCodeId to be removed"
        )
    }

    @Test
    @Order(9)
    fun `delete encounter`() {
        val deleteResponse = rest.exchange(
            "/api/patients/$patientId/encounters/$createdEncounterId",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.statusCode)
    }
}
