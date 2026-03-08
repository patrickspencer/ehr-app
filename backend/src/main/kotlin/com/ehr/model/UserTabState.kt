package com.ehr.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "user_tab_state")
class UserTabState(
    @Id
    @Column(name = "user_id")
    var userId: Long = 0,

    @Column(name = "tab_state", nullable = false, columnDefinition = "TEXT")
    var tabState: String = """{"tabs":[],"activeTabId":null}""",

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
