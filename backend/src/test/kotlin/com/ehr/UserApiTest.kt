package com.ehr

import com.ehr.dto.UserDto
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus

class UserApiTest : BaseIntegrationTest() {

    @Test
    @Order(1)
    fun `list all users`() {
        val response = rest.exchange(
            "/api/users",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<UserDto>>() {}
        )
        assertEquals(HttpStatus.OK, response.statusCode)
        val users = response.body!!
        assertEquals(6, users.size, "Expected 6 users")
        users.forEach {
            assertTrue(it.id > 0)
            assertTrue(it.firstName.isNotBlank())
            assertTrue(it.lastName.isNotBlank())
            assertTrue(it.role.isNotBlank())
            assertTrue(it.email.isNotBlank())
        }
    }

    @Test
    @Order(2)
    fun `get user by id`() {
        val users = rest.exchange(
            "/api/users",
            HttpMethod.GET,
            null,
            object : ParameterizedTypeReference<List<UserDto>>() {}
        ).body!!
        val first = users.first()

        val response = rest.getForEntity("/api/users/${first.id}", UserDto::class.java)
        assertEquals(HttpStatus.OK, response.statusCode)
        val user = response.body!!
        assertEquals(first.id, user.id)
        assertEquals(first.firstName, user.firstName)
        assertEquals(first.lastName, user.lastName)
        assertEquals(first.role, user.role)
        assertEquals(first.email, user.email)
    }
}
