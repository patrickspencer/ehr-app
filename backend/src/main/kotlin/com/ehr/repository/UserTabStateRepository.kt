package com.ehr.repository

import com.ehr.model.UserTabState
import org.springframework.data.jpa.repository.JpaRepository

interface UserTabStateRepository : JpaRepository<UserTabState, Long>
