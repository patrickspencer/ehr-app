package com.ehr.config

import ca.uhn.fhir.context.FhirContext
import ca.uhn.fhir.rest.client.api.IGenericClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FhirConfig {

    @Value("\${fhir.server.url}")
    private lateinit var fhirServerUrl: String

    @Bean
    fun fhirContext(): FhirContext = FhirContext.forR4()

    @Bean
    fun fhirClient(fhirContext: FhirContext): IGenericClient =
        fhirContext.newRestfulGenericClient(fhirServerUrl)
}
