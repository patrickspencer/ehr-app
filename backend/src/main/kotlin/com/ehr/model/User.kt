package com.ehr.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(name = "first_name", nullable = false, length = 100)
    var firstName: String = "",

    @Column(name = "last_name", nullable = false, length = 100)
    var lastName: String = "",

    @Column(nullable = false, length = 50)
    var role: String = "",

    @Column(length = 50)
    var title: String? = null,

    @Column(unique = true, nullable = false, length = 100)
    var email: String = "",

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
