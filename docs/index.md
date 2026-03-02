# EHR App

An electronic health records application built with a modern stack:

- **Frontend:** Next.js 14+ with TypeScript and React Context
- **Backend:** Spring Boot 3.5.0 with Kotlin 1.9.25
- **Clinical Data:** HAPI FHIR R4 Server (v7.6.0)
- **Lookup Data:** PostgreSQL 15

Clinical records (patients, encounters, notes, diagnoses, procedures) are stored as FHIR R4 resources. Reference data (users, ICD-10 codes, CPT codes) lives in Postgres. A mapping table bridges frontend integer IDs to FHIR server UUIDs.

```{toctree}
:maxdepth: 2

architecture
fhir-integration
api-reference
```
