package com.ehr.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "patient_allergies")
class PatientAllergyEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(name = "patient_id", nullable = false)
    var patientId: Long = 0,

    @Column(nullable = false, length = 120)
    var allergen: String = "",

    @Column(length = 255)
    var reaction: String? = null,

    @Column(nullable = false, length = 20)
    var severity: String = "",

    @Column(name = "noted_at")
    var notedAt: LocalDate? = null,

    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
