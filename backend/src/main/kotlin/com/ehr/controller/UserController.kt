package com.ehr.controller

import com.ehr.dto.UserDto
import com.ehr.service.UserService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping
    fun list(): List<UserDto> {
        return userService.findAll()
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): UserDto {
        return userService.getById(id)
    }
}
