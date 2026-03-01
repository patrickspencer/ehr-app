package com.ehr.service

import com.ehr.dto.UserDto
import com.ehr.mapper.toDto
import com.ehr.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {

    fun findAll(): List<UserDto> {
        return userRepository.findAll().map { it.toDto() }
    }

    fun getById(id: Long): UserDto {
        val user = userRepository.findById(id)
            .orElseThrow { NoSuchElementException("User not found with id: $id") }
        return user.toDto()
    }
}
