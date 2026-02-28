package com.ehr.model

import jakarta.persistence.*

@Entity
@Table(name = "icd10_codes")
class Icd10Code(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false, unique = true, length = 10)
    var code: String = "",

    @Column(nullable = false, length = 255)
    var description: String = ""
)
