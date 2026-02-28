package com.ehr.service

import com.ehr.dto.CptCodeDto
import com.ehr.mapper.toDto
import com.ehr.repository.CptCodeRepository
import org.springframework.stereotype.Service

@Service
class CptCodeService(private val cptCodeRepository: CptCodeRepository) {

    fun search(query: String?): List<CptCodeDto> {
        val codes = if (query.isNullOrBlank()) {
            cptCodeRepository.findAll()
        } else {
            cptCodeRepository.search(query)
        }
        return codes.map { it.toDto() }
    }
}
