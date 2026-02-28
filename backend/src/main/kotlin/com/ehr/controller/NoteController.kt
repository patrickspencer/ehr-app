package com.ehr.controller

import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto
import com.ehr.service.NoteService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/patients/{patientId}/notes")
class NoteController(private val noteService: NoteService) {

    @GetMapping
    fun getByPatientId(@PathVariable patientId: Long): List<NoteDto> {
        return noteService.getByPatientId(patientId)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@PathVariable patientId: Long, @RequestBody request: NoteCreateRequest): NoteDto {
        return noteService.create(patientId, request)
    }

    @PutMapping("/{noteId}")
    fun update(@PathVariable noteId: Long, @RequestBody request: NoteCreateRequest): NoteDto {
        return noteService.update(noteId, request)
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable noteId: Long) {
        noteService.delete(noteId)
    }
}
