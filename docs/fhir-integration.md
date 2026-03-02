# FHIR Integration

## FHIR R4 Resources

The application stores clinical data as FHIR R4 resources on a HAPI FHIR server (v7.6.0). Each domain concept maps to a standard FHIR resource type:

| Domain     | FHIR Resource     | Key Fields                                           |
|------------|-------------------|------------------------------------------------------|
| Patient    | Patient           | name, birthDate, gender, custom extensions           |
| Encounter  | Encounter         | status, period, subject reference, custom extensions  |
| Diagnosis  | Condition         | ICD-10 code, subject/encounter references            |
| Procedure  | Procedure         | CPT code, subject/encounter references               |
| Note       | DocumentReference | Base64-encoded text content, author, subject ref     |

## Mapper Objects

Three mapper objects in `com.ehr.fhir` handle conversion between FHIR resources and application DTOs.

### FhirPatientMapper

Converts between FHIR `Patient` and `PatientDto` / `PatientCreateRequest`.

**Custom extensions** (namespace `http://ehr.com/fhir/StructureDefinition/`):

| Extension       | Type        | Purpose                |
|-----------------|-------------|------------------------|
| `created-at`    | InstantType | Creation timestamp     |
| `phone`         | StringType  | Phone number           |
| `email`         | StringType  | Email address          |
| `address`       | StringType  | Street address         |

**Gender mapping:**

| Input            | FHIR Value | Display Output |
|------------------|------------|----------------|
| `MALE` or `M`   | MALE       | "Male"         |
| `FEMALE` or `F` | FEMALE     | "Female"       |
| `OTHER`          | OTHER      | "Other"        |

### FhirEncounterMapper

Converts between FHIR `Encounter`, `Condition`, `Procedure` and `EncounterDto`.

**Custom extensions** (same namespace):

| Extension        | Purpose              |
|------------------|----------------------|
| `created-at`     | Creation timestamp   |
| `encounter-type` | Encounter type       |
| `provider`       | Provider name        |
| `reason`         | Reason for encounter |

**Code systems:**

| System                                                    | Use            |
|-----------------------------------------------------------|----------------|
| `http://hl7.org/fhir/sid/icd-10-cm`                      | Diagnosis codes|
| `http://www.ama-assn.org/go/cpt`                         | Procedure codes|
| `http://terminology.hl7.org/CodeSystem/v3-ActCode` (AMB)  | Encounter class|
| `http://terminology.hl7.org/CodeSystem/condition-clinical`| Condition status|

**Encounter status mapping:**

| Application Status | FHIR Status  |
|--------------------|--------------|
| `PLANNED`          | PLANNED      |
| `IN_PROGRESS`      | INPROGRESS   |
| `COMPLETED`        | FINISHED     |
| `CANCELLED`        | CANCELLED    |

### FhirNoteMapper

Converts between FHIR `DocumentReference` and `NoteDto`.

Note content is stored as a Base64-encoded `text/plain` attachment on the DocumentReference. The author is stored in the `author` reference field. The `created-at` custom extension tracks the creation timestamp.

## FhirIdMapping Bridge

The frontend uses Long integer IDs for all resources. The FHIR server assigns string UUIDs. The `fhir_id_mapping` table in Postgres bridges these two systems.

| Column          | Type         | Description                          |
|-----------------|--------------|--------------------------------------|
| `id`            | Long (PK)    | Auto-generated primary key           |
| `resource_type` | String(50)   | `"Patient"`, `"Encounter"`, `"DocumentReference"`, `"Condition"`, `"Procedure"` |
| `legacy_id`     | Long         | Frontend-facing integer ID           |
| `fhir_id`       | String(255)  | FHIR server UUID                     |

When a resource is created, the service:
1. Creates the FHIR resource on the HAPI server
2. Receives the server-assigned UUID
3. Inserts a `fhir_id_mapping` row linking a new sequential Long ID to the FHIR UUID
4. Returns the Long ID to the frontend

## Data Flow Example: Create Patient

```
Frontend                    Backend                     HAPI FHIR
   │                           │                           │
   │  POST /api/patients       │                           │
   │  {firstName, lastName,    │                           │
   │   dateOfBirth, ...}       │                           │
   │──────────────────────────▶│                           │
   │                           │  FhirPatientMapper        │
   │                           │  .toFhirPatient(request)  │
   │                           │                           │
   │                           │  fhirClient.create()      │
   │                           │──────────────────────────▶│
   │                           │                           │
   │                           │◀──── Patient (UUID assigned)
   │                           │                           │
   │                           │  Save FhirIdMapping       │
   │                           │  (legacyId ↔ fhirId)      │
   │                           │                           │
   │                           │  FhirPatientMapper        │
   │                           │  .toDto(patient, legacyId)│
   │                           │                           │
   │◀──── PatientDto (Long id) │                           │
   │                           │                           │
```

## FHIR Search Indexing Delay

After creating a resource, the HAPI FHIR server may not immediately index it for search. This means a search query issued right after a create may not return the new resource.

**Workaround:** The `addDiagnosis` and `addProcedure` services build the response DTO directly from the created resource rather than re-fetching via search. Tests use API responses directly instead of re-querying after creation.
