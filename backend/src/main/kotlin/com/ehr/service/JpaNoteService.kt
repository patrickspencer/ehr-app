package com.ehr.service

import com.ehr.dto.NoteCreateRequest
import com.ehr.dto.NoteDto
import com.ehr.mapper.toDto
import com.ehr.model.NoteEntity
import com.ehr.repository.NoteEntityRepository
import com.ehr.repository.PatientEntityRepository
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
@Profile("!fhir")
class JpaNoteService(
    private val repository: NoteEntityRepository,
    private val patientRepository: PatientEntityRepository
) : NoteService {

    override fun getByPatientId(patientId: Long): List<NoteDto> {
        return repository.findByPatientIdOrderByUpdatedAtDesc(patientId)
            .map { it.toDto() }
    }

    override fun create(patientId: Long, request: NoteCreateRequest): NoteDto {
        if (!patientRepository.existsById(patientId)) {
            throw NoSuchElementException("Patient not found with id: $patientId")
        }
        val entity = NoteEntity(
            patientId = patientId,
            content = request.content,
            author = request.author
        )
        return repository.save(entity).toDto()
    }

    override fun update(noteId: Long, request: NoteCreateRequest): NoteDto {
        val entity = repository.findById(noteId)
            .orElseThrow { NoSuchElementException("Note not found with id: $noteId") }
        entity.content = request.content
        entity.author = request.author
        entity.updatedAt = LocalDateTime.now()
        return repository.save(entity).toDto()
    }

    override fun delete(noteId: Long) {
        if (!repository.existsById(noteId)) {
            throw NoSuchElementException("Note not found with id: $noteId")
        }
        repository.deleteById(noteId)
    }
}
