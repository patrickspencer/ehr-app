package com.ehr.service

import com.ehr.dto.Icd10CodeDto
import com.ehr.mapper.toDto
import com.ehr.repository.Icd10CodeRepository
import org.springframework.stereotype.Service

@Service
class Icd10CodeService(private val icd10CodeRepository: Icd10CodeRepository) {

    fun search(query: String?): List<Icd10CodeDto> {
        val codes = if (query.isNullOrBlank()) {
            icd10CodeRepository.findAll()
        } else {
            icd10CodeRepository.search(query)
        }
        return codes.map { it.toDto() }
    }
}
