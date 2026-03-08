package com.ehr.service

import com.ehr.dto.TabStateDto
import com.ehr.dto.TabStateSaveRequest
import com.ehr.model.UserTabState
import com.ehr.repository.UserRepository
import com.ehr.repository.UserTabStateRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class UserTabStateService(
    private val userTabStateRepository: UserTabStateRepository,
    private val userRepository: UserRepository
) {

    fun getByUserId(userId: Long): TabStateDto {
        if (!userRepository.existsById(userId)) {
            throw NoSuchElementException("User not found with id: $userId")
        }
        val state = userTabStateRepository.findById(userId).orElse(null)
        return if (state != null) {
            TabStateDto(state.userId, state.tabState, state.updatedAt)
        } else {
            TabStateDto(userId, """{"tabs":[],"activeTabId":null}""", LocalDateTime.now())
        }
    }

    @Transactional
    fun save(userId: Long, request: TabStateSaveRequest): TabStateDto {
        if (!userRepository.existsById(userId)) {
            throw NoSuchElementException("User not found with id: $userId")
        }
        val now = LocalDateTime.now()
        val state = userTabStateRepository.findById(userId).orElse(null)
        val saved = if (state != null) {
            state.tabState = request.tabState
            state.updatedAt = now
            userTabStateRepository.save(state)
        } else {
            userTabStateRepository.save(UserTabState(userId, request.tabState, now))
        }
        return TabStateDto(saved.userId, saved.tabState, saved.updatedAt)
    }
}
