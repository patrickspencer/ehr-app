package com.ehr.repository

import com.ehr.model.Icd10Code
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface Icd10CodeRepository : JpaRepository<Icd10Code, Long> {

    @Query("SELECT c FROM Icd10Code c WHERE LOWER(c.code) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    fun search(@Param("query") query: String): List<Icd10Code>

    fun findByCode(code: String): Icd10Code?
}
