export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface Note {
  id: number;
  patientId: number;
  encounterId: number | null;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteCreateRequest {
  content: string;
  author: string;
}

export interface Encounter {
  id: number;
  patientId: number;
  encounterDate: string;
  encounterType: string;
  status: string;
  provider: string;
  reason: string | null;
  diagnoses: Icd10Code[];
  procedures: CptCode[];
  createdAt: string;
  updatedAt: string;
}

export interface EncounterCreateRequest {
  encounterDate: string;
  encounterType: string;
  status: string;
  provider: string;
  reason: string | null;
}

export interface Icd10Code {
  id: number;
  code: string;
  description: string;
}

export interface CptCode {
  id: number;
  code: string;
  description: string;
}
