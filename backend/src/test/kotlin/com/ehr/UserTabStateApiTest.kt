package com.ehr

import com.ehr.dto.TabStateDto
import com.ehr.dto.TabStateSaveRequest
import com.ehr.dto.UserDto
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus

class UserTabStateApiTest : BaseIntegrationTest() {

    private fun firstUserId(): Long {
        val users = rest.exchange(
            "/api/users",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<UserDto>>() {}
        ).body!!
        return users.first().id
    }

    @Test
    @Order(1)
    fun `get tabs returns empty default for user with no saved state`() {
        val userId = firstUserId()
        val response = rest.getForEntity("/api/users/$userId/tabs", TabStateDto::class.java)
        assertEquals(HttpStatus.OK, response.statusCode)
        val dto = response.body!!
        assertEquals(userId, dto.userId)
        assertEquals("""{"tabs":[],"activeTabId":null}""", dto.tabState)
    }

    @Test
    @Order(2)
    fun `save and retrieve tab state`() {
        val userId = firstUserId()
        val tabState = """{"tabs":[{"patientId":1,"patientName":"Sarah Johnson"}],"activeTabId":1}"""

        val saveResponse = rest.exchange(
            "/api/users/$userId/tabs",
            HttpMethod.PUT,
            HttpEntity(TabStateSaveRequest(tabState)),
            TabStateDto::class.java
        )
        assertEquals(HttpStatus.OK, saveResponse.statusCode)
        val saved = saveResponse.body!!
        assertEquals(userId, saved.userId)
        assertEquals(tabState, saved.tabState)
        assertNotNull(saved.updatedAt)

        val getResponse = rest.getForEntity("/api/users/$userId/tabs", TabStateDto::class.java)
        assertEquals(HttpStatus.OK, getResponse.statusCode)
        val fetched = getResponse.body!!
        assertEquals(tabState, fetched.tabState)
    }

    @Test
    @Order(3)
    fun `save overwrites existing tab state`() {
        val userId = firstUserId()
        val first = """{"tabs":[{"patientId":1,"patientName":"Sarah Johnson"}],"activeTabId":1}"""
        rest.exchange(
            "/api/users/$userId/tabs",
            HttpMethod.PUT,
            HttpEntity(TabStateSaveRequest(first)),
            TabStateDto::class.java
        )

        val second = """{"tabs":[{"patientId":2,"patientName":"Michael Chen"}],"activeTabId":2}"""
        val response = rest.exchange(
            "/api/users/$userId/tabs",
            HttpMethod.PUT,
            HttpEntity(TabStateSaveRequest(second)),
            TabStateDto::class.java
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(second, response.body!!.tabState)

        val fetched = rest.getForEntity("/api/users/$userId/tabs", TabStateDto::class.java)
        assertEquals(second, fetched.body!!.tabState)
    }

    @Test
    @Order(4)
    fun `get tabs for nonexistent user returns error`() {
        val response = rest.getForEntity("/api/users/99999/tabs", String::class.java)
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    }

    @Test
    @Order(5)
    fun `save tabs for nonexistent user returns error`() {
        val response = rest.exchange(
            "/api/users/99999/tabs",
            HttpMethod.PUT,
            HttpEntity(TabStateSaveRequest("""{"tabs":[],"activeTabId":null}""")),
            String::class.java
        )
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    }
}
