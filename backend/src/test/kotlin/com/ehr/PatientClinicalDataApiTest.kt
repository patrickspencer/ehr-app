package com.ehr

import com.ehr.dto.PatientAllergyDto
import com.ehr.dto.PatientAllergyUpsertRequest
import com.ehr.dto.PatientConditionDto
import com.ehr.dto.PatientConditionUpsertRequest
import com.ehr.dto.PatientMedicationDto
import com.ehr.dto.PatientMedicationUpsertRequest
import com.ehr.dto.PatientRiskDto
import com.ehr.dto.PatientDto
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus

class PatientClinicalDataApiTest : BaseIntegrationTest() {

    private fun findPatientByLastName(lastName: String): Long {
        val patients = rest.exchange(
            "/api/patients",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientDto>>() {}
        ).body!!

        return patients.first { it.lastName.equals(lastName, ignoreCase = true) }.id
    }

    @Test
    fun `allergy endpoints support crud`() {
        val patientId = findPatientByLastName("Johnson")

        val initial = rest.exchange(
            "/api/patients/$patientId/allergies",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientAllergyDto>>() {}
        )
        assertEquals(HttpStatus.OK, initial.statusCode)
        assertTrue(initial.body!!.isNotEmpty())

        val created = rest.postForEntity(
            "/api/patients/$patientId/allergies",
            PatientAllergyUpsertRequest("Latex", "Localized rash", "Low", null),
            PatientAllergyDto::class.java
        )
        assertEquals(HttpStatus.CREATED, created.statusCode)
        val createdBody = created.body!!
        assertEquals("Latex", createdBody.allergen)

        val updated = rest.exchange(
            "/api/patients/$patientId/allergies/${createdBody.id}",
            HttpMethod.PUT,
            HttpEntity(PatientAllergyUpsertRequest("Latex", "Contact rash", "Moderate", null)),
            PatientAllergyDto::class.java
        )
        assertEquals(HttpStatus.OK, updated.statusCode)
        assertEquals("Moderate", updated.body!!.severity)

        val deleted = rest.exchange(
            "/api/patients/$patientId/allergies/${createdBody.id}",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, deleted.statusCode)
    }

    @Test
    fun `condition endpoints support crud`() {
        val patientId = findPatientByLastName("Chen")

        val created = rest.postForEntity(
            "/api/patients/$patientId/conditions",
            PatientConditionUpsertRequest(
                conditionName = "Prediabetes",
                icd10Code = "R73.03",
                status = "Monitoring",
                diagnosedAt = null,
                notes = "Watching A1c trend."
            ),
            PatientConditionDto::class.java
        )
        assertEquals(HttpStatus.CREATED, created.statusCode)
        val createdBody = created.body!!
        assertEquals("Prediabetes", createdBody.conditionName)

        val updated = rest.exchange(
            "/api/patients/$patientId/conditions/${createdBody.id}",
            HttpMethod.PUT,
            HttpEntity(
                PatientConditionUpsertRequest(
                    conditionName = "Prediabetes",
                    icd10Code = "R73.03",
                    status = "Stable",
                    diagnosedAt = null,
                    notes = "Improving with lifestyle changes."
                )
            ),
            PatientConditionDto::class.java
        )
        assertEquals(HttpStatus.OK, updated.statusCode)
        assertEquals("Stable", updated.body!!.status)

        val deleted = rest.exchange(
            "/api/patients/$patientId/conditions/${createdBody.id}",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, deleted.statusCode)
    }

    @Test
    fun `medication endpoints support crud`() {
        val patientId = findPatientByLastName("Johnson")

        val created = rest.postForEntity(
            "/api/patients/$patientId/medications",
            PatientMedicationUpsertRequest(
                medicationName = "Montelukast",
                dose = "10 mg",
                route = "Oral",
                frequency = "Nightly",
                status = "Active",
                startedAt = null,
                instructions = "Take in the evening."
            ),
            PatientMedicationDto::class.java
        )
        assertEquals(HttpStatus.CREATED, created.statusCode)
        val createdBody = created.body!!
        assertEquals("Montelukast", createdBody.medicationName)

        val updated = rest.exchange(
            "/api/patients/$patientId/medications/${createdBody.id}",
            HttpMethod.PUT,
            HttpEntity(
                PatientMedicationUpsertRequest(
                    medicationName = "Montelukast",
                    dose = "10 mg",
                    route = "Oral",
                    frequency = "Nightly",
                    status = "PRN",
                    startedAt = null,
                    instructions = "Use seasonally if symptoms recur."
                )
            ),
            PatientMedicationDto::class.java
        )
        assertEquals(HttpStatus.OK, updated.statusCode)
        assertEquals("PRN", updated.body!!.status)

        val deleted = rest.exchange(
            "/api/patients/$patientId/medications/${createdBody.id}",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, deleted.statusCode)
    }

    @Test
    fun `risk endpoint returns seeded flags`() {
        val patientId = findPatientByLastName("Johnson")
        val response = rest.exchange(
            "/api/patients/$patientId/risks",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientRiskDto>>() {}
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        val risks = response.body!!
        assertTrue(risks.isNotEmpty(), "Expected seeded risks for patient $patientId")
        assertTrue(risks.all { it.patientId == patientId })
        assertEquals("Medication Sensitivity", risks.first().riskName)
    }
}
