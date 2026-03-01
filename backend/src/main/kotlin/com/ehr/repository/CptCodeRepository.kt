package com.ehr.repository

import com.ehr.model.CptCode
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CptCodeRepository : JpaRepository<CptCode, Long> {

    @Query("SELECT c FROM CptCode c WHERE LOWER(c.code) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    fun search(@Param("query") query: String): List<CptCode>

    fun findByCode(code: String): CptCode?
}
