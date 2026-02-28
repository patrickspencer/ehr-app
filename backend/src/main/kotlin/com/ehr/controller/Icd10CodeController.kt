package com.ehr.controller

import com.ehr.dto.Icd10CodeDto
import com.ehr.service.Icd10CodeService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/icd10-codes")
class Icd10CodeController(private val icd10CodeService: Icd10CodeService) {

    @GetMapping
    fun search(@RequestParam(required = false) q: String?): List<Icd10CodeDto> {
        return icd10CodeService.search(q)
    }
}
