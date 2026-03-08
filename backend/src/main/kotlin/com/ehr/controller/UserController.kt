package com.ehr.controller

import com.ehr.dto.TabStateDto
import com.ehr.dto.TabStateSaveRequest
import com.ehr.dto.UserDto
import com.ehr.service.UserService
import com.ehr.service.UserTabStateService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
    private val userTabStateService: UserTabStateService
) {

    @GetMapping
    fun list(): List<UserDto> {
        return userService.findAll()
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): UserDto {
        return userService.getById(id)
    }

    @GetMapping("/{id}/tabs")
    fun getTabs(@PathVariable id: Long): TabStateDto {
        return userTabStateService.getByUserId(id)
    }

    @PutMapping("/{id}/tabs")
    fun saveTabs(@PathVariable id: Long, @RequestBody request: TabStateSaveRequest): TabStateDto {
        return userTabStateService.save(id, request)
    }
}
