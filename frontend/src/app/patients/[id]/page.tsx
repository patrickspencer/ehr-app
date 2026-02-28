"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Patient, Note, NoteCreateRequest, Encounter } from "@/types";
import { getPatient, deletePatient, getNotes, createNote, getEncounters } from "@/lib/api";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";
import EncounterList from "@/components/EncounterList";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, n, e] = await Promise.all([getPatient(id), getNotes(id), getEncounters(id)]);
        setPatient(p);
        setNotes(n);
        setEncounters(e);
      } catch {
        setPatient(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    await deletePatient(id);
    router.push("/");
  }

  async function handleAddNote(data: NoteCreateRequest) {
    const note = await createNote(id, data);
    setNotes((prev) => [...prev, note]);
  }

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (!patient) return <p className="text-center text-red-500 py-8">Patient not found.</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Demographics */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="flex gap-3">
            <Link
              href={`/patients/${id}/edit`}
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
            <dt className="text-xs font-semibold uppercase text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.dateOfBirth}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-500">Gender</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.gender}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.phone || "N/A"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.email || "N/A"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.address || "N/A"}</dd>
          </div>
        </dl>
      </div>

      {/* Encounters */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Encounters</h2>
          <Link
            href={`/patients/${id}/encounters/new`}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
          >
            New Encounter
          </Link>
        </div>
        <EncounterList encounters={encounters} patientId={id} />
      </div>

      {/* Notes */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Clinical Notes</h2>
        <NoteList notes={notes} />
      </div>

      {/* Add Note Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Note</h3>
        <NoteForm onSubmit={handleAddNote} />
      </div>
    </div>
  );
}
