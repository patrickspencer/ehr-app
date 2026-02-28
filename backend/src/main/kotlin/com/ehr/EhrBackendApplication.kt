package com.ehr

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class EhrBackendApplication

fun main(args: Array<String>) {
	runApplication<EhrBackendApplication>(*args)
}
