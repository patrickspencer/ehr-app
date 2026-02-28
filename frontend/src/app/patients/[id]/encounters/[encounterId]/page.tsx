"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Encounter, Note, NoteCreateRequest } from "@/types";
import {
  getEncounter,
  deleteEncounter,
  getNotes,
  createNote,
  addDiagnosis,
  removeDiagnosis,
  addProcedure,
  removeProcedure,
  searchIcd10Codes,
  searchCptCodes,
} from "@/lib/api";
import CodeList from "@/components/CodeList";
import CodeSearch from "@/components/CodeSearch";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";

const typeLabels: Record<string, string> = {
  OFFICE_VISIT: "Office Visit",
  ANNUAL_EXAM: "Annual Exam",
  NEW_PATIENT: "New Patient",
  FOLLOW_UP: "Follow-Up",
  URGENT_CARE: "Urgent Care",
  TELEHEALTH: "Telehealth",
  EMERGENCY: "Emergency",
  PROCEDURE: "Procedure",
};

const statusColors: Record<string, string> = {
  PLANNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export default function EncounterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params.id);
  const encounterId = Number(params.encounterId);

  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [enc, allNotes] = await Promise.all([
          getEncounter(patientId, encounterId),
          getNotes(patientId),
        ]);
        setEncounter(enc);
        setNotes(allNotes.filter((n) => n.encounterId === encounterId));
      } catch {
        setEncounter(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId, encounterId]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this encounter?")) return;
    await deleteEncounter(patientId, encounterId);
    router.push(`/patients/${patientId}`);
  }

  async function handleAddNote(data: NoteCreateRequest) {
    const note = await createNote(patientId, data);
    setNotes((prev) => [...prev, note]);
  }

  async function handleAddDiagnosis(code: { id: number }) {
    const updated = await addDiagnosis(patientId, encounterId, code.id);
    setEncounter(updated);
  }

  async function handleRemoveDiagnosis(codeId: number) {
    const updated = await removeDiagnosis(patientId, encounterId, codeId);
    setEncounter(updated);
  }

  async function handleAddProcedure(code: { id: number }) {
    const updated = await addProcedure(patientId, encounterId, code.id);
    setEncounter(updated);
  }

  async function handleRemoveProcedure(codeId: number) {
    const updated = await removeProcedure(patientId, encounterId, codeId);
    setEncounter(updated);
  }

  const searchIcd10 = useCallback((q: string) => searchIcd10Codes(q), []);
  const searchCpt = useCallback((q: string) => searchCptCodes(q), []);

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (!encounter) return <p className="text-center text-red-500 py-8">Encounter not found.</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Link href={`/patients/${patientId}`} className="text-sm text-teal-600 hover:text-teal-800">
              &larr; Back to Patient
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {typeLabels[encounter.encounterType] || encounter.encounterType}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/patients/${patientId}/encounters/${encounterId}/edit`}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{encounter.encounterDate}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-500">Status</dt>
            <dd className="mt-1">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[encounter.status] || "bg-gray-100 text-gray-700"}`}>
                {encounter.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-500">Provider</dt>
            <dd className="mt-1 text-sm text-gray-900">{encounter.provider}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-500">Type</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {typeLabels[encounter.encounterType] || encounter.encounterType}
            </dd>
          </div>
          {encounter.reason && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase text-gray-500">Reason</dt>
              <dd className="mt-1 text-sm text-gray-900">{encounter.reason}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Diagnoses (ICD-10) */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Diagnoses (ICD-10)</h2>
        <CodeList
          codes={encounter.diagnoses}
          onRemove={handleRemoveDiagnosis}
          emptyMessage="No diagnoses assigned."
        />
        <div className="mt-4">
          <CodeSearch
            label="Add Diagnosis"
            placeholder="Search ICD-10 codes..."
            searchFn={searchIcd10}
            onSelect={handleAddDiagnosis}
            excludeIds={encounter.diagnoses.map((d) => d.id)}
          />
        </div>
      </div>

      {/* Procedures (CPT) */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Procedures (CPT)</h2>
        <CodeList
          codes={encounter.procedures}
          onRemove={handleRemoveProcedure}
          emptyMessage="No procedures assigned."
        />
        <div className="mt-4">
          <CodeSearch
            label="Add Procedure"
            placeholder="Search CPT codes..."
            searchFn={searchCpt}
            onSelect={handleAddProcedure}
            excludeIds={encounter.procedures.map((p) => p.id)}
          />
        </div>
      </div>

      {/* Notes linked to this encounter */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Clinical Notes</h2>
        <NoteList notes={notes} />
      </div>

      {/* Add Note */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Note</h3>
        <NoteForm onSubmit={handleAddNote} encounterId={encounterId} />
      </div>
    </div>
  );
}
