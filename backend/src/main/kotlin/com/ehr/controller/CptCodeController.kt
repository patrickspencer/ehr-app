package com.ehr.controller

import com.ehr.dto.CptCodeDto
import com.ehr.service.CptCodeService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/cpt-codes")
class CptCodeController(private val cptCodeService: CptCodeService) {

    @GetMapping
    fun search(@RequestParam(required = false) q: String?): List<CptCodeDto> {
        return cptCodeService.search(q)
    }
}
