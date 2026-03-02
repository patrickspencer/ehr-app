# API Reference

All endpoints are served from the backend at `http://localhost:8091`. Request and response bodies use JSON.

## Patients

### `GET /api/patients/count`

Returns the total number of patients.

**Response:** `200 OK`
```json
{ "count": 42 }
```

### `GET /api/patients`

List all patients, optionally filtered by search query.

**Query parameters:**

| Param | Type   | Description                                |
|-------|--------|--------------------------------------------|
| `q`   | string | Optional. Searches first name, last name.  |

**Response:** `200 OK` — `PatientDto[]`
```json
[
  {
    "id": 1,
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "Female",
    "phone": "555-0100",
    "email": "jane@example.com",
    "address": "123 Main St",
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-01-01T10:00:00"
  }
]
```

### `GET /api/patients/{id}`

Get a single patient by ID.

**Path parameters:** `id` (Long)

**Response:** `200 OK` — `PatientDto`

### `POST /api/patients`

Create a new patient.

**Request body:** `PatientCreateRequest`
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "FEMALE",
  "phone": "555-0100",
  "email": "jane@example.com",
  "address": "123 Main St"
}
```

`gender`, `phone`, `email`, and `address` are optional.

**Response:** `201 Created` — `PatientDto`

### `PUT /api/patients/{id}`

Update an existing patient.

**Path parameters:** `id` (Long)

**Request body:** `PatientCreateRequest` (same shape as create)

**Response:** `200 OK` — `PatientDto`

### `DELETE /api/patients/{id}`

Delete a patient and all associated FHIR resources.

**Path parameters:** `id` (Long)

**Response:** `204 No Content`

---

## Encounters

### `GET /api/patients/{patientId}/encounters`

List all encounters for a patient.

**Path parameters:** `patientId` (Long)

**Response:** `200 OK` — `EncounterDto[]`
```json
[
  {
    "id": 1,
    "patientId": 1,
    "encounterDate": "2025-03-15",
    "encounterType": "OFFICE_VISIT",
    "status": "COMPLETED",
    "provider": "Dr. Smith",
    "reason": "Annual checkup",
    "diagnoses": [
      { "id": 1, "code": "I10", "description": "Essential hypertension" }
    ],
    "procedures": [
      { "id": 1, "code": "99213", "description": "Office visit, established patient" }
    ],
    "createdAt": "2025-03-15T09:00:00",
    "updatedAt": "2025-03-15T09:00:00"
  }
]
```

### `GET /api/patients/{patientId}/encounters/{encounterId}`

Get a single encounter.

**Path parameters:** `patientId` (Long), `encounterId` (Long)

**Response:** `200 OK` — `EncounterDto`

### `POST /api/patients/{patientId}/encounters`

Create a new encounter for a patient.

**Path parameters:** `patientId` (Long)

**Request body:** `EncounterCreateRequest`
```json
{
  "encounterDate": "2025-03-15",
  "encounterType": "OFFICE_VISIT",
  "status": "PLANNED",
  "provider": "Dr. Smith",
  "reason": "Annual checkup"
}
```

`status` defaults to `"PLANNED"` if omitted. `reason` is optional.

**Response:** `201 Created` — `EncounterDto`

### `PUT /api/patients/{patientId}/encounters/{encounterId}`

Update an existing encounter.

**Path parameters:** `patientId` (Long), `encounterId` (Long)

**Request body:** `EncounterCreateRequest` (same shape as create)

**Response:** `200 OK` — `EncounterDto`

### `DELETE /api/patients/{patientId}/encounters/{encounterId}`

Delete an encounter and its associated diagnoses and procedures.

**Path parameters:** `patientId` (Long), `encounterId` (Long)

**Response:** `204 No Content`

### `POST /api/patients/{patientId}/encounters/{encounterId}/diagnoses`

Add a diagnosis (ICD-10 code) to an encounter.

**Path parameters:** `patientId` (Long), `encounterId` (Long)

**Request body:** `CodeAssignRequest`
```json
{ "codeId": 5 }
```

`codeId` refers to the `id` of an `icd10_codes` row.

**Response:** `200 OK` — `EncounterDto` (updated, with new diagnosis included)

### `DELETE /api/patients/{patientId}/encounters/{encounterId}/diagnoses/{codeId}`

Remove a diagnosis from an encounter.

**Path parameters:** `patientId` (Long), `encounterId` (Long), `codeId` (Long)

**Response:** `200 OK` — `EncounterDto`

### `POST /api/patients/{patientId}/encounters/{encounterId}/procedures`

Add a procedure (CPT code) to an encounter.

**Path parameters:** `patientId` (Long), `encounterId` (Long)

**Request body:** `CodeAssignRequest`
```json
{ "codeId": 3 }
```

`codeId` refers to the `id` of a `cpt_codes` row.

**Response:** `200 OK` — `EncounterDto` (updated, with new procedure included)

### `DELETE /api/patients/{patientId}/encounters/{encounterId}/procedures/{codeId}`

Remove a procedure from an encounter.

**Path parameters:** `patientId` (Long), `encounterId` (Long), `codeId` (Long)

**Response:** `200 OK` — `EncounterDto`

---

## Notes

### `GET /api/patients/{patientId}/notes`

List all notes for a patient.

**Path parameters:** `patientId` (Long)

**Response:** `200 OK` — `NoteDto[]`
```json
[
  {
    "id": 1,
    "patientId": 1,
    "encounterId": null,
    "content": "Patient reports improved symptoms.",
    "author": "Dr. Smith",
    "createdAt": "2025-03-15T10:30:00",
    "updatedAt": "2025-03-15T10:30:00"
  }
]
```

### `POST /api/patients/{patientId}/notes`

Create a new note for a patient.

**Path parameters:** `patientId` (Long)

**Request body:** `NoteCreateRequest`
```json
{
  "content": "Patient reports improved symptoms.",
  "author": "Dr. Smith"
}
```

**Response:** `201 Created` — `NoteDto`

### `PUT /api/patients/{patientId}/notes/{noteId}`

Update a note.

**Path parameters:** `patientId` (Long), `noteId` (Long)

**Request body:** `NoteCreateRequest` (same shape as create)

**Response:** `200 OK` — `NoteDto`

### `DELETE /api/patients/{patientId}/notes/{noteId}`

Delete a note.

**Path parameters:** `patientId` (Long), `noteId` (Long)

**Response:** `204 No Content`

---

## Users

### `GET /api/users`

List all users.

**Response:** `200 OK` — `UserDto[]`
```json
[
  {
    "id": 1,
    "firstName": "Alice",
    "lastName": "Smith",
    "role": "DOCTOR",
    "title": "MD",
    "email": "alice.smith@example.com",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

### `GET /api/users/{id}`

Get a single user by ID.

**Path parameters:** `id` (Long)

**Response:** `200 OK` — `UserDto`

---

## ICD-10 Codes

### `GET /api/icd10-codes`

Search ICD-10 diagnosis codes.

**Query parameters:**

| Param | Type   | Description                              |
|-------|--------|------------------------------------------|
| `q`   | string | Optional. Searches code and description. |

**Response:** `200 OK` — `Icd10CodeDto[]`
```json
[
  { "id": 1, "code": "I10", "description": "Essential (primary) hypertension" }
]
```

---

## CPT Codes

### `GET /api/cpt-codes`

Search CPT procedure codes.

**Query parameters:**

| Param | Type   | Description                              |
|-------|--------|------------------------------------------|
| `q`   | string | Optional. Searches code and description. |

**Response:** `200 OK` — `CptCodeDto[]`
```json
[
  { "id": 1, "code": "99213", "description": "Office visit, established patient" }
]
```
