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
@Table(name = "patient_medications")
class PatientMedicationEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(name = "patient_id", nullable = false)
    var patientId: Long = 0,

    @Column(name = "medication_name", nullable = false, length = 150)
    var medicationName: String = "",

    @Column(length = 100)
    var dose: String? = null,

    @Column(length = 50)
    var route: String? = null,

    @Column(length = 100)
    var frequency: String? = null,

    @Column(nullable = false, length = 30)
    var status: String = "",

    @Column(name = "started_at")
    var startedAt: LocalDate? = null,

    @Column(columnDefinition = "TEXT")
    var instructions: String? = null,

    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
