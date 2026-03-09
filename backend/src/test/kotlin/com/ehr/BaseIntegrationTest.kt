package com.ehr

import ca.uhn.fhir.rest.client.api.IGenericClient
import com.ehr.dto.EncounterCreateRequest
import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.PatientCreateRequest
import com.ehr.dto.PatientDto
import com.ehr.repository.FhirIdMappingRepository
import org.hl7.fhir.r4.model.Bundle
import org.hl7.fhir.r4.model.Parameters
import org.hl7.fhir.r4.model.BooleanType
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestMethodOrder
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import java.time.LocalDate
import java.util.concurrent.atomic.AtomicBoolean

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test", "fhir")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation::class)
abstract class BaseIntegrationTest {

    companion object {
        private val initialized = AtomicBoolean(false)
    }

    @Autowired
    lateinit var rest: TestRestTemplate

    @Autowired(required = false)
    var fhirClient: IGenericClient? = null

    @Autowired(required = false)
    var fhirIdMappingRepository: FhirIdMappingRepository? = null

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @BeforeAll
    fun resetData() {
        if (!initialized.compareAndSet(false, true)) return

        jdbcTemplate.execute("DELETE FROM patient_allergies")
        jdbcTemplate.execute("DELETE FROM patient_conditions")
        jdbcTemplate.execute("DELETE FROM patient_medications")
        jdbcTemplate.execute("DELETE FROM patient_risks")

        if (fhirClient != null) {
            wipeFhirResources("DocumentReference")
            wipeFhirResources("Procedure")
            wipeFhirResources("Condition")
            wipeFhirResources("Encounter")
            wipeFhirResources("Patient")
            fhirIdMappingRepository?.deleteAll()
        } else {
            jdbcTemplate.execute("DELETE FROM encounter_diagnoses")
            jdbcTemplate.execute("DELETE FROM encounter_procedures")
            jdbcTemplate.execute("DELETE FROM notes")
            jdbcTemplate.execute("DELETE FROM encounters")
            jdbcTemplate.execute("DELETE FROM patients")
        }

        seedViaApi()
    }

    private fun seedViaApi() {
        data class SeedPatient(
            val firstName: String, val lastName: String, val dob: LocalDate,
            val gender: String, val phone: String, val email: String, val address: String
        )

        val patients = listOf(
            SeedPatient("Sarah", "Johnson", LocalDate.of(1985, 3, 15), "Female", "555-0101", "sarah.johnson@email.com", "123 Oak Street"),
            SeedPatient("Michael", "Chen", LocalDate.of(1972, 11, 28), "Male", "555-0102", "michael.chen@email.com", "456 Maple Ave"),
            SeedPatient("Emily", "Williams", LocalDate.of(1990, 7, 4), "Female", "555-0103", "emily.williams@email.com", "789 Pine Road"),
            SeedPatient("James", "Martinez", LocalDate.of(1968, 1, 22), "Male", "555-0104", "james.martinez@email.com", "321 Elm Blvd"),
            SeedPatient("Aisha", "Patel", LocalDate.of(1995, 9, 10), "Female", "555-0105", "aisha.patel@email.com", "654 Cedar Lane")
        )

        val createdPatients = mutableListOf<PatientDto>()
        for (p in patients) {
            val dto = rest.postForEntity(
                "/api/patients",
                PatientCreateRequest(p.firstName, p.lastName, p.dob, p.gender, p.phone, p.email, p.address),
                PatientDto::class.java
            ).body!!
            createdPatients.add(dto)
        }

        // Create encounters for first patient
        val sarahId = createdPatients[0].id
        rest.postForEntity(
            "/api/patients/$sarahId/encounters",
            EncounterCreateRequest(LocalDate.of(2025, 9, 15), "OFFICE_VISIT", "COMPLETED", "Dr. Roberts", "Seasonal allergy symptoms"),
            Void::class.java
        )
        rest.postForEntity(
            "/api/patients/$sarahId/encounters",
            EncounterCreateRequest(LocalDate.of(2025, 10, 13), "OFFICE_VISIT", "COMPLETED", "Dr. Roberts", "Allergy follow-up"),
            Void::class.java
        )
        rest.postForEntity(
            "/api/patients/$sarahId/encounters",
            EncounterCreateRequest(LocalDate.of(2026, 3, 15), "OFFICE_VISIT", "PLANNED", "Dr. Roberts", "Spring allergy check-in"),
            Void::class.java
        )

        // Create encounters for second patient
        val michaelId = createdPatients[1].id
        rest.postForEntity(
            "/api/patients/$michaelId/encounters",
            EncounterCreateRequest(LocalDate.of(2025, 8, 20), "ANNUAL_EXAM", "COMPLETED", "Dr. Thompson", "Annual physical"),
            Void::class.java
        )

        // Create notes for first patient
        rest.postForEntity(
            "/api/patients/$sarahId/notes",
            NoteCreateRequest("Patient presents with mild seasonal allergies. Prescribed cetirizine 10mg daily.", "Dr. Roberts"),
            Void::class.java
        )
        rest.postForEntity(
            "/api/patients/$sarahId/notes",
            NoteCreateRequest("Follow-up visit: allergy symptoms improved significantly.", "Dr. Roberts"),
            Void::class.java
        )

        // Create notes for second patient
        rest.postForEntity(
            "/api/patients/$michaelId/notes",
            NoteCreateRequest("Annual physical exam. Blood pressure 128/82, BMI 24.5. All labs normal.", "Dr. Thompson"),
            Void::class.java
        )

        seedClinicalData(sarahId, michaelId)
    }

    private fun seedClinicalData(sarahId: Long, michaelId: Long) {
        jdbcTemplate.update(
            """
            INSERT INTO patient_allergies (patient_id, allergen, reaction, severity, noted_at, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            sarahId, "Pollen", "Sneezing and congestion", "Moderate", LocalDate.of(2019, 4, 12), 1
        )
        jdbcTemplate.update(
            """
            INSERT INTO patient_allergies (patient_id, allergen, reaction, severity, noted_at, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            sarahId, "Cat dander", "Itchy eyes and wheezing", "Low", LocalDate.of(2020, 8, 3), 2
        )
        jdbcTemplate.update(
            """
            INSERT INTO patient_conditions (patient_id, condition_name, icd10_code, status, diagnosed_at, notes, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            sarahId, "Allergic rhinitis", "J30.1", "Active", LocalDate.of(2019, 4, 12), "Seasonal spring flare pattern.", 1
        )
        jdbcTemplate.update(
            """
            INSERT INTO patient_medications (patient_id, medication_name, dose, route, frequency, status, started_at, instructions, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            sarahId,
            "Cetirizine",
            "10 mg",
            "Oral",
            "Daily",
            "Active",
            LocalDate.of(2024, 3, 10),
            "Take during high-allergen seasons.",
            1
        )

        jdbcTemplate.update(
            """
            INSERT INTO patient_allergies (patient_id, allergen, reaction, severity, noted_at, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            michaelId, "Shellfish", "Hives", "Moderate", LocalDate.of(2015, 6, 9), 1
        )
        jdbcTemplate.update(
            """
            INSERT INTO patient_conditions (patient_id, condition_name, icd10_code, status, diagnosed_at, notes, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            michaelId, "Essential hypertension", "I10", "Active", LocalDate.of(2022, 3, 14), "Home readings borderline.", 1
        )
        jdbcTemplate.update(
            """
            INSERT INTO patient_medications (patient_id, medication_name, dose, route, frequency, status, started_at, instructions, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            michaelId,
            "Lisinopril",
            "10 mg",
            "Oral",
            "Daily",
            "Active",
            LocalDate.of(2023, 3, 14),
            "Hold for symptomatic hypotension.",
            1
        )
        jdbcTemplate.update(
            """
            INSERT INTO patient_risks (patient_id, risk_name, level, details, sort_order)
            VALUES (?, ?, ?, ?, ?)
            """.trimIndent(),
            sarahId,
            "Medication Sensitivity",
            "Moderate",
            "Allergy history requires medication review.",
            1
        )
        jdbcTemplate.update(
            """
            INSERT INTO patient_risks (patient_id, risk_name, level, details, sort_order)
            VALUES (?, ?, ?, ?, ?)
            """.trimIndent(),
            michaelId,
            "Cardiovascular Risk",
            "Moderate",
            "Chronic metabolic disease increases long-term risk.",
            1
        )
    }

    @Suppress("UNCHECKED_CAST")
    private fun wipeFhirResources(resourceType: String) {
        val client = fhirClient ?: return
        var bundle = client.search<Bundle>()
            .forResource(resourceType)
            .count(200)
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        while (bundle.entry?.isNotEmpty() == true) {
            for (entry in bundle.entry) {
                try {
                    val id = entry.resource.idElement
                    client.delete().resourceById(id).execute()
                } catch (_: Exception) {
                    // Ignore delete failures — resource may have already been deleted
                }
            }
            bundle = client.search<Bundle>()
                .forResource(resourceType)
                .count(200)
                .returnBundle(Bundle::class.java)
                .execute() as Bundle
        }

        try {
            client.operation()
                .onType(resourceType)
                .named("\$expunge")
                .withParameter(Parameters::class.java, "expungeDeletedResources", BooleanType(true))
                .execute()
        } catch (_: Exception) {
            // Expunge may not be enabled
        }
    }
}
