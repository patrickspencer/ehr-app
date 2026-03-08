package com.ehr.model

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "encounters")
class EncounterEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(name = "patient_id", nullable = false)
    var patientId: Long = 0,

    @Column(name = "encounter_date", nullable = false)
    var encounterDate: LocalDate = LocalDate.now(),

    @Column(name = "encounter_type", nullable = false, length = 50)
    var encounterType: String = "",

    @Column(nullable = false, length = 30)
    var status: String = "PLANNED",

    @Column(nullable = false, length = 100)
    var provider: String = "",

    @Column(columnDefinition = "TEXT")
    var reason: String? = null,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "encounter_diagnoses",
        joinColumns = [JoinColumn(name = "encounter_id")],
        inverseJoinColumns = [JoinColumn(name = "icd10_code_id")]
    )
    var diagnoses: MutableSet<Icd10Code> = mutableSetOf(),

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "encounter_procedures",
        joinColumns = [JoinColumn(name = "encounter_id")],
        inverseJoinColumns = [JoinColumn(name = "cpt_code_id")]
    )
    var procedures: MutableSet<CptCode> = mutableSetOf(),

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
