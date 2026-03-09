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
@Table(name = "patient_conditions")
class PatientConditionEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(name = "patient_id", nullable = false)
    var patientId: Long = 0,

    @Column(name = "condition_name", nullable = false, length = 150)
    var conditionName: String = "",

    @Column(name = "icd10_code", length = 10)
    var icd10Code: String? = null,

    @Column(nullable = false, length = 30)
    var status: String = "",

    @Column(name = "diagnosed_at")
    var diagnosedAt: LocalDate? = null,

    @Column(columnDefinition = "TEXT")
    var notes: String? = null,

    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
