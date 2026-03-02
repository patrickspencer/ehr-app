# Architecture

## System Overview

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│              │     │                  │     │  HAPI FHIR R4    │
│   Next.js    │────▶│  Spring Boot     │────▶│  (port 8092)     │
│  (frontend)  │     │  (port 8091)     │     │  Clinical data   │
│              │     │                  │     └──────────────────┘
└──────────────┘     │                  │     ┌──────────────────┐
                     │                  │────▶│  PostgreSQL 15   │
                     │                  │     │  (port 5433)     │
                     └──────────────────┘     │  Lookup tables   │
                                              └──────────────────┘
```

The frontend talks exclusively to the Spring Boot backend. The backend routes clinical data operations to the HAPI FHIR server and lookup/reference queries to Postgres.

## Data Store Responsibilities

### HAPI FHIR Server (Clinical Data)

All clinical records are stored as FHIR R4 resources:

| Domain     | FHIR Resource       |
|------------|----------------------|
| Patients   | Patient              |
| Encounters | Encounter            |
| Diagnoses  | Condition            |
| Procedures | Procedure            |
| Notes      | DocumentReference    |

### PostgreSQL (Lookup & Mapping Data)

| Table            | Purpose                                    |
|------------------|--------------------------------------------|
| `users`          | Physicians and staff                       |
| `icd10_codes`    | ICD-10 diagnosis code catalog              |
| `cpt_codes`      | CPT procedure code catalog                 |
| `fhir_id_mapping`| Bridges frontend Long IDs ↔ FHIR UUIDs    |

## Backend (Spring Boot + Kotlin)

### Package Layout

- `com.ehr.controller` — REST controllers
- `com.ehr.service` — Business logic
- `com.ehr.fhir` — FHIR resource mappers (`FhirPatientMapper`, `FhirEncounterMapper`, `FhirNoteMapper`)
- `com.ehr.model` — JPA entities (`User`, `Icd10Code`, `CptCode`, `FhirIdMapping`)
- `com.ehr.repository` — Spring Data JPA repositories
- `com.ehr.dto` — Request/response DTOs
- `com.ehr.config` — Configuration (FHIR client, CORS)

### Key Dependencies

- Spring Boot 3.5.0
- Kotlin 1.9.25
- HAPI FHIR 7.6.0 (base, client, structures-r4)
- Spring Data JPA + PostgreSQL driver

## Frontend (Next.js + TypeScript)

### Pages (App Router)

| Route                                           | Purpose              |
|-------------------------------------------------|----------------------|
| `/`                                             | Home / Dashboard     |
| `/patients/new`                                 | Create patient       |
| `/patients/[id]`                                | Patient workspace    |
| `/patients/[id]/edit`                           | Edit patient         |
| `/patients/[id]/encounters/new`                 | Create encounter     |
| `/patients/[id]/encounters/[encounterId]`       | View encounter       |
| `/patients/[id]/encounters/[encounterId]/edit`  | Edit encounter       |

### Key Components

- **AppShell** — Main application container
- **TabBar** — Multi-patient tab switcher with search dropdown
- **PatientWorkspace** — Central workspace showing encounters and notes
- **PatientSidebar** — Demographic details sidebar
- **CodeSearch** — ICD-10 / CPT code lookup
- **LoginScreen** — User selection / authentication

### State Management (React Context)

- **AuthContext** — Current user session; persists user ID to `localStorage`
- **TabContext** — Open patient tabs; persists per-user to `localStorage`

## Docker Compose Services

| Service       | Image                       | Host Port | Container Port | Database |
|---------------|-----------------------------|-----------|----------------|----------|
| `postgres`    | `postgres:15`               | 5433      | 5432           | `ehr`, `hapi` |
| `hapi-fhir`   | `hapiproject/hapi:v7.6.0`  | 8092      | 8080           | `hapi`   |

Both services share the same Postgres instance. An init script (`init-hapi-db.sql`) creates the `hapi` database for the FHIR server on first run.

The backend Spring Boot application runs outside Docker on port **8091**.
