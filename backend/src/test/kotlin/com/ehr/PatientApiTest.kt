package com.ehr

import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import java.time.LocalDate

class PatientApiTest : BaseIntegrationTest() {

    companion object {
        var createdPatientId: Long = 0
    }

    @Test
    @Order(1)
    fun `list all patients returns seeded data`() {
        val response = rest.exchange(
            "/api/patients",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val patients = response.body!!
        assertTrue(patients.size >= 5, "Expected at least 5 seeded patients, got ${patients.size}")
    }

    @Test
    @Order(2)
    fun `search patients by name`() {
        val response = rest.exchange(
            "/api/patients?q=chen",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val patients = response.body!!
        assertTrue(patients.isNotEmpty(), "Expected to find patient matching 'chen'")
        assertTrue(
            patients.any { it.lastName.equals("Chen", ignoreCase = true) },
            "Expected Michael Chen in results"
        )
    }

    @Test
    @Order(3)
    fun `get patient by id`() {
        val allPatients = rest.exchange(
            "/api/patients",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientDto>>() {}
        ).body!!
        val first = allPatients.first()

        val response = rest.getForEntity("/api/patients/${first.id}", PatientDto::class.java)
        assertEquals(HttpStatus.OK, response.statusCode)
        val patient = response.body!!
        assertEquals(first.id, patient.id)
        assertEquals(first.firstName, patient.firstName)
        assertEquals(first.lastName, patient.lastName)
    }

    @Test
    @Order(4)
    fun `create patient`() {
        val request = PatientCreateRequest(
            firstName = "Test",
            lastName = "Integration",
            dateOfBirth = LocalDate.of(2000, 1, 15),
            gender = "Male",
            phone = "555-0199",
            email = "test@integration.com",
            address = "123 Test St"
        )
        val response = rest.postForEntity("/api/patients", request, PatientDto::class.java)
        assertEquals(HttpStatus.CREATED, response.statusCode)
        val patient = response.body!!
        assertTrue(patient.id > 0)
        assertEquals("Test", patient.firstName)
        assertEquals("Integration", patient.lastName)
        assertEquals(LocalDate.of(2000, 1, 15), patient.dateOfBirth)
        assertEquals("Male", patient.gender)
        assertEquals("555-0199", patient.phone)
        assertEquals("test@integration.com", patient.email)
        assertNotNull(patient.createdAt)
        createdPatientId = patient.id
    }

    @Test
    @Order(5)
    fun `update patient`() {
        val request = PatientCreateRequest(
            firstName = "TestUpdated",
            lastName = "IntegrationUpdated",
            dateOfBirth = LocalDate.of(2000, 1, 15),
            gender = "Female",
            phone = "555-0200",
            email = "updated@integration.com",
            address = "456 Updated Ave"
        )
        val response = rest.exchange(
            "/api/patients/$createdPatientId",
            HttpMethod.PUT,
            HttpEntity(request),
            PatientDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val patient = response.body!!
        assertEquals(createdPatientId, patient.id)
        assertEquals("TestUpdated", patient.firstName)
        assertEquals("IntegrationUpdated", patient.lastName)
        assertEquals("Female", patient.gender)
        assertEquals("555-0200", patient.phone)
    }

    @Test
    @Order(6)
    fun `delete patient`() {
        val deleteResponse = rest.exchange(
            "/api/patients/$createdPatientId",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.statusCode)

        val getResponse = rest.getForEntity("/api/patients/$createdPatientId", String::class.java)
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, getResponse.statusCode)
    }

    @Test
    @Order(7)
    fun `count endpoint`() {
        val response = rest.getForEntity("/api/patients/count", Map::class.java)
        assertEquals(HttpStatus.OK, response.statusCode)
        val count = (response.body!!["count"] as Number).toLong()
        assertTrue(count >= 5, "Expected at least 5 patients, got $count")
    }
}
