package com.ehr.service

import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto
import com.ehr.mapper.toDto
import com.ehr.mapper.toEntity
import com.ehr.repository.NoteRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class NoteService(private val noteRepository: NoteRepository) {

    fun getByPatientId(patientId: Long): List<NoteDto> {
        return noteRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
            .map { it.toDto() }
    }

    fun create(patientId: Long, request: NoteCreateRequest): NoteDto {
        val note = request.toEntity(patientId)
        return noteRepository.save(note).toDto()
    }

    fun update(noteId: Long, request: NoteCreateRequest): NoteDto {
        val note = noteRepository.findById(noteId)
            .orElseThrow { NoSuchElementException("Note not found with id: $noteId") }
        note.content = request.content
        note.author = request.author
        note.updatedAt = LocalDateTime.now()
        return noteRepository.save(note).toDto()
    }

    fun delete(noteId: Long) {
        if (!noteRepository.existsById(noteId)) {
            throw NoSuchElementException("Note not found with id: $noteId")
        }
        noteRepository.deleteById(noteId)
    }
}
