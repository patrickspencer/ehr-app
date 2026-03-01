package com.ehr

import com.ehr.dto.CptCodeDto
import com.ehr.dto.Icd10CodeDto
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus

class LookupApiTest : BaseIntegrationTest() {

    @Test
    fun `search icd10 codes`() {
        val response = rest.exchange(
            "/api/icd10-codes?q=diabetes",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<Icd10CodeDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val codes = response.body!!
        assertTrue(codes.isNotEmpty(), "Expected ICD-10 codes matching 'diabetes'")
        codes.forEach {
            assertTrue(it.id > 0)
            assertTrue(it.code.isNotBlank())
            assertTrue(it.description.isNotBlank())
        }
    }

    @Test
    fun `search cpt codes`() {
        val response = rest.exchange(
            "/api/cpt-codes?q=office",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<CptCodeDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val codes = response.body!!
        assertTrue(codes.isNotEmpty(), "Expected CPT codes matching 'office'")
        codes.forEach {
            assertTrue(it.id > 0)
            assertTrue(it.code.isNotBlank())
            assertTrue(it.description.isNotBlank())
        }
    }

    @Test
    fun `list all icd10 codes with no query`() {
        val response = rest.exchange(
            "/api/icd10-codes",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<Icd10CodeDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val codes = response.body!!
        assertTrue(codes.size >= 50, "Expected at least 50 ICD-10 codes, got ${codes.size}")
    }

    @Test
    fun `list all cpt codes with no query`() {
        val response = rest.exchange(
            "/api/cpt-codes",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<CptCodeDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val codes = response.body!!
        assertTrue(codes.size >= 40, "Expected at least 40 CPT codes, got ${codes.size}")
    }
}
