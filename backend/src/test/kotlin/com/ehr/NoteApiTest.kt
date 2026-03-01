package com.ehr

import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto
import com.ehr.dto.PatientDto
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus

class NoteApiTest : BaseIntegrationTest() {

    companion object {
        var patientId: Long = 0
        var createdNoteId: Long = 0
    }

    private fun findPatientWithNotes(): Long {
        val patients = rest.exchange(
            "/api/patients",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<PatientDto>>() {}
        ).body!!

        for (patient in patients) {
            val notes = rest.exchange(
                "/api/patients/${patient.id}/notes",
                HttpMethod.GET,
                null,
                object : ParameterizedTypeReference<List<NoteDto>>() {}
            ).body!!
            if (notes.isNotEmpty()) {
                patientId = patient.id
                return patient.id
            }
        }
        return fail("No patient with notes found")
    }

    @Test
    @Order(1)
    fun `list notes for patient`() {
        val pid = findPatientWithNotes()
        val response = rest.exchange(
            "/api/patients/$pid/notes",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<NoteDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val notes = response.body!!
        assertTrue(notes.isNotEmpty(), "Expected notes for patient $pid")
        notes.forEach { assertEquals(pid, it.patientId) }
    }

    @Test
    @Order(2)
    fun `create note`() {
        val request = NoteCreateRequest(
            content = "Integration test note content",
            author = "Dr. Test"
        )
        val response = rest.postForEntity(
            "/api/patients/$patientId/notes",
            request,
            NoteDto::class.java
        )
        assertEquals(HttpStatus.CREATED, response.statusCode)
        val note = response.body!!
        assertTrue(note.id > 0)
        assertEquals(patientId, note.patientId)
        assertEquals("Integration test note content", note.content)
        assertEquals("Dr. Test", note.author)
        assertNotNull(note.createdAt)
        createdNoteId = note.id
    }

    @Test
    @Order(3)
    fun `update note`() {
        val request = NoteCreateRequest(
            content = "Updated integration test note",
            author = "Dr. Updated"
        )
        val response = rest.exchange(
            "/api/patients/$patientId/notes/$createdNoteId",
            HttpMethod.PUT,
            HttpEntity(request),
            NoteDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val note = response.body!!
        assertEquals(createdNoteId, note.id)
        assertEquals("Updated integration test note", note.content)
        assertEquals("Dr. Updated", note.author)
    }

    @Test
    @Order(4)
    fun `delete note`() {
        val deleteResponse = rest.exchange(
            "/api/patients/$patientId/notes/$createdNoteId",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.statusCode)
    }
}
