import { User, Patient, PatientCreateRequest, Note, NoteCreateRequest, Encounter, EncounterCreateRequest, Icd10Code, CptCode } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8091";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Users

export function getUsers(): Promise<User[]> {
  return request<User[]>("/api/users");
}

export function getUser(id: number): Promise<User> {
  return request<User>(`/api/users/${id}`);
}

// Patients

export function getPatients(query?: string): Promise<Patient[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<Patient[]>(`/api/patients${params}`);
}

export function getPatient(id: number): Promise<Patient> {
  return request<Patient>(`/api/patients/${id}`);
}

export function createPatient(data: PatientCreateRequest): Promise<Patient> {
  return request<Patient>("/api/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updatePatient(id: number, data: PatientCreateRequest): Promise<Patient> {
  return request<Patient>(`/api/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deletePatient(id: number): Promise<void> {
  return request<void>(`/api/patients/${id}`, { method: "DELETE" });
}

export function getNotes(patientId: number): Promise<Note[]> {
  return request<Note[]>(`/api/patients/${patientId}/notes`);
}

export function createNote(patientId: number, data: NoteCreateRequest): Promise<Note> {
  return request<Note>(`/api/patients/${patientId}/notes`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateNote(patientId: number, noteId: number, data: NoteCreateRequest): Promise<Note> {
  return request<Note>(`/api/patients/${patientId}/notes/${noteId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteNote(patientId: number, noteId: number): Promise<void> {
  return request<void>(`/api/patients/${patientId}/notes/${noteId}`, { method: "DELETE" });
}

// Encounters

export function getEncounters(patientId: number): Promise<Encounter[]> {
  return request<Encounter[]>(`/api/patients/${patientId}/encounters`);
}

export function getEncounter(patientId: number, encounterId: number): Promise<Encounter> {
  return request<Encounter>(`/api/patients/${patientId}/encounters/${encounterId}`);
}

export function createEncounter(patientId: number, data: EncounterCreateRequest): Promise<Encounter> {
  return request<Encounter>(`/api/patients/${patientId}/encounters`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateEncounter(patientId: number, encounterId: number, data: EncounterCreateRequest): Promise<Encounter> {
  return request<Encounter>(`/api/patients/${patientId}/encounters/${encounterId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteEncounter(patientId: number, encounterId: number): Promise<void> {
  return request<void>(`/api/patients/${patientId}/encounters/${encounterId}`, { method: "DELETE" });
}

// Billing codes

export function searchIcd10Codes(query?: string): Promise<Icd10Code[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<Icd10Code[]>(`/api/icd10-codes${params}`);
}

export function searchCptCodes(query?: string): Promise<CptCode[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<CptCode[]>(`/api/cpt-codes${params}`);
}

export function addDiagnosis(patientId: number, encounterId: number, codeId: number): Promise<Encounter> {
  return request<Encounter>(`/api/patients/${patientId}/encounters/${encounterId}/diagnoses`, {
    method: "POST",
    body: JSON.stringify({ codeId }),
  });
}

export function removeDiagnosis(patientId: number, encounterId: number, codeId: number): Promise<Encounter> {
  return request<Encounter>(`/api/patients/${patientId}/encounters/${encounterId}/diagnoses/${codeId}`, {
    method: "DELETE",
  });
}

export function addProcedure(patientId: number, encounterId: number, codeId: number): Promise<Encounter> {
  return request<Encounter>(`/api/patients/${patientId}/encounters/${encounterId}/procedures`, {
    method: "POST",
    body: JSON.stringify({ codeId }),
  });
}

export function removeProcedure(patientId: number, encounterId: number, codeId: number): Promise<Encounter> {
  return request<Encounter>(`/api/patients/${patientId}/encounters/${encounterId}/procedures/${codeId}`, {
    method: "DELETE",
  });
}
