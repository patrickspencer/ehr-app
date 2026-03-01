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
import org.springframework.test.context.ActiveProfiles
import java.time.LocalDate
import java.util.concurrent.atomic.AtomicBoolean

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation::class)
abstract class BaseIntegrationTest {

    companion object {
        private val initialized = AtomicBoolean(false)
    }

    @Autowired
    lateinit var rest: TestRestTemplate

    @Autowired
    lateinit var fhirClient: IGenericClient

    @Autowired
    lateinit var fhirIdMappingRepository: FhirIdMappingRepository

    @BeforeAll
    fun resetFhirData() {
        if (!initialized.compareAndSet(false, true)) return

        wipeFhirResources("DocumentReference")
        wipeFhirResources("Procedure")
        wipeFhirResources("Condition")
        wipeFhirResources("Encounter")
        wipeFhirResources("Patient")
        fhirIdMappingRepository.deleteAll()
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
    }

    @Suppress("UNCHECKED_CAST")
    private fun wipeFhirResources(resourceType: String) {
        var bundle = fhirClient.search<Bundle>()
            .forResource(resourceType)
            .count(200)
            .returnBundle(Bundle::class.java)
            .execute() as Bundle

        while (bundle.entry?.isNotEmpty() == true) {
            for (entry in bundle.entry) {
                try {
                    val id = entry.resource.idElement
                    fhirClient.delete().resourceById(id).execute()
                } catch (_: Exception) {
                    // Ignore delete failures — resource may have already been deleted
                }
            }
            bundle = fhirClient.search<Bundle>()
                .forResource(resourceType)
                .count(200)
                .returnBundle(Bundle::class.java)
                .execute() as Bundle
        }

        try {
            fhirClient.operation()
                .onType(resourceType)
                .named("\$expunge")
                .withParameter(Parameters::class.java, "expungeDeletedResources", BooleanType(true))
                .execute()
        } catch (_: Exception) {
            // Expunge may not be enabled
        }
    }
}
