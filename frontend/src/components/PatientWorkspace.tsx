"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Patient,
  PatientCreateRequest,
  Note,
  NoteCreateRequest,
  Encounter,
  EncounterCreateRequest,
} from "@/types";
import {
  getPatient,
  deletePatient,
  updatePatient,
  getNotes,
  createNote,
  getEncounters,
  getEncounter,
  createEncounter,
  updateEncounter,
  deleteEncounter,
  addDiagnosis,
  removeDiagnosis,
  addProcedure,
  removeProcedure,
  searchIcd10Codes,
  searchCptCodes,
} from "@/lib/api";
import { useTabs } from "@/contexts/TabContext";
import PatientSidebar, { SidebarSection } from "@/components/PatientSidebar";
import PatientForm from "@/components/PatientForm";
import EncounterForm from "@/components/EncounterForm";
import EncounterList from "@/components/EncounterList";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";
import CodeList from "@/components/CodeList";
import CodeSearch from "@/components/CodeSearch";

type WorkspaceView =
  | { type: "overview" }
  | { type: "editPatient" }
  | { type: "encounters" }
  | { type: "newEncounter" }
  | { type: "encounterDetail"; encounterId: number }
  | { type: "editEncounter"; encounterId: number }
  | { type: "charts" };

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

function viewToSection(view: WorkspaceView): SidebarSection {
  switch (view.type) {
    case "overview":
    case "editPatient":
      return "overview";
    case "encounters":
    case "newEncounter":
    case "encounterDetail":
    case "editEncounter":
      return "encounters";
    case "charts":
      return "charts";
  }
}

interface PatientWorkspaceProps {
  patientId: number;
}

export default function PatientWorkspace({ patientId }: PatientWorkspaceProps) {
  const { closeTab } = useTabs();
  const [view, setView] = useState<WorkspaceView>({ type: "overview" });
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, n, e] = await Promise.all([
          getPatient(patientId),
          getNotes(patientId),
          getEncounters(patientId),
        ]);
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
  }, [patientId]);

  async function handleDeletePatient() {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    await deletePatient(patientId);
    closeTab(patientId);
  }

  async function handleUpdatePatient(data: PatientCreateRequest) {
    const updated = await updatePatient(patientId, data);
    setPatient(updated);
    setView({ type: "overview" });
  }

  async function handleAddNote(data: NoteCreateRequest) {
    const note = await createNote(patientId, data);
    setNotes((prev) => [...prev, note]);
  }

  async function handleCreateEncounter(data: EncounterCreateRequest) {
    const enc = await createEncounter(patientId, data);
    setEncounters((prev) => [...prev, enc]);
    setView({ type: "encounters" });
  }

  function handleViewEncounter(encounterId: number) {
    setView({ type: "encounterDetail", encounterId });
  }

  function handleSidebarNavigate(section: SidebarSection) {
    switch (section) {
      case "overview":
        setView({ type: "overview" });
        break;
      case "encounters":
        setView({ type: "encounters" });
        break;
      case "charts":
        setView({ type: "charts" });
        break;
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)]">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-[calc(100vh-5rem)]">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-500">Patient not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      <PatientSidebar
        activeSection={viewToSection(view)}
        onNavigate={handleSidebarNavigate}
        patientName={`${patient.firstName} ${patient.lastName}`}
      />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <WorkspaceContent
          view={view}
          setView={setView}
          patient={patient}
          notes={notes}
          encounters={encounters}
          patientId={patientId}
          onDeletePatient={handleDeletePatient}
          onUpdatePatient={handleUpdatePatient}
          onAddNote={handleAddNote}
          onCreateEncounter={handleCreateEncounter}
          onViewEncounter={handleViewEncounter}
          onEncountersChanged={setEncounters}
        />
      </div>
    </div>
  );
}

// Renders the content area based on current view
function WorkspaceContent({
  view,
  setView,
  patient,
  notes,
  encounters,
  patientId,
  onDeletePatient,
  onUpdatePatient,
  onAddNote,
  onCreateEncounter,
  onViewEncounter,
  onEncountersChanged,
}: {
  view: WorkspaceView;
  setView: (v: WorkspaceView) => void;
  patient: Patient;
  notes: Note[];
  encounters: Encounter[];
  patientId: number;
  onDeletePatient: () => void;
  onUpdatePatient: (data: PatientCreateRequest) => Promise<void>;
  onAddNote: (data: NoteCreateRequest) => Promise<void>;
  onCreateEncounter: (data: EncounterCreateRequest) => Promise<void>;
  onViewEncounter: (id: number) => void;
  onEncountersChanged: React.Dispatch<React.SetStateAction<Encounter[]>>;
}) {
  if (view.type === "editPatient") {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Edit Patient: {patient.firstName} {patient.lastName}
        </h1>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <PatientForm
            initialData={{
              firstName: patient.firstName,
              lastName: patient.lastName,
              dateOfBirth: patient.dateOfBirth,
              gender: patient.gender,
              phone: patient.phone,
              email: patient.email,
              address: patient.address,
            }}
            onSubmit={onUpdatePatient}
            submitLabel="Update Patient"
            onCancel={() => setView({ type: "overview" })}
          />
        </div>
      </div>
    );
  }

  if (view.type === "newEncounter") {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">New Encounter</h1>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <EncounterForm
            onSubmit={onCreateEncounter}
            onCancel={() => setView({ type: "encounters" })}
          />
        </div>
      </div>
    );
  }

  if (view.type === "editEncounter") {
    return (
      <EditEncounterView
        patientId={patientId}
        encounterId={view.encounterId}
        onDone={(updated) => {
          if (updated) {
            onEncountersChanged((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e))
            );
          }
          setView({ type: "encounterDetail", encounterId: view.encounterId });
        }}
        onCancel={() => setView({ type: "encounterDetail", encounterId: view.encounterId })}
      />
    );
  }

  if (view.type === "encounterDetail") {
    return (
      <EncounterDetailView
        patientId={patientId}
        encounterId={view.encounterId}
        onBack={() => setView({ type: "encounters" })}
        onEdit={() => setView({ type: "editEncounter", encounterId: view.encounterId })}
        onDeleted={() => {
          onEncountersChanged((prev) => prev.filter((e) => e.id !== view.encounterId));
          setView({ type: "encounters" });
        }}
      />
    );
  }

  if (view.type === "encounters") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Encounters</h1>
          <button
            onClick={() => setView({ type: "newEncounter" })}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
          >
            New Encounter
          </button>
        </div>
        <EncounterList
          encounters={encounters}
          patientId={patientId}
          onView={onViewEncounter}
        />
      </div>
    );
  }

  if (view.type === "charts") {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Charts</h1>
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">Charts coming soon</h3>
          <p className="mt-1 text-sm text-gray-500">
            Patient charts and visualizations will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Overview (default)
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Demographics */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setView({ type: "editPatient" })}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDeletePatient}
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

      {/* Recent Encounters */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Encounters</h2>
          <button
            onClick={() => setView({ type: "encounters" })}
            className="text-sm font-medium text-teal-600 hover:text-teal-800"
          >
            View all
          </button>
        </div>
        <EncounterList
          encounters={encounters.slice(0, 5)}
          patientId={patientId}
          onView={onViewEncounter}
        />
      </div>

      {/* Notes */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Clinical Notes</h2>
        <NoteList notes={notes.filter((n) => !n.encounterId)} />
      </div>

      {/* Add Note Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Note</h3>
        <NoteForm onSubmit={onAddNote} />
      </div>
    </div>
  );
}

// --- Sub-components for encounter views ---

function EncounterDetailView({
  patientId,
  encounterId,
  onBack,
  onEdit,
  onDeleted,
}: {
  patientId: number;
  encounterId: number;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}) {
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
    onDeleted();
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
            <button onClick={onBack} className="text-sm text-teal-600 hover:text-teal-800">
              &larr; Back to Encounters
            </button>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {typeLabels[encounter.encounterType] || encounter.encounterType}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              Edit
            </button>
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
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  statusColors[encounter.status] || "bg-gray-100 text-gray-700"
                }`}
              >
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

      {/* Diagnoses */}
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

      {/* Procedures */}
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

      {/* Notes */}
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

function EditEncounterView({
  patientId,
  encounterId,
  onDone,
  onCancel,
}: {
  patientId: number;
  encounterId: number;
  onDone: (updated: Encounter | null) => void;
  onCancel: () => void;
}) {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const enc = await getEncounter(patientId, encounterId);
        setEncounter(enc);
      } catch {
        setEncounter(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId, encounterId]);

  async function handleSubmit(data: EncounterCreateRequest) {
    const updated = await updateEncounter(patientId, encounterId, data);
    onDone(updated);
  }

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (!encounter) return <p className="text-center text-red-500 py-8">Encounter not found.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Encounter</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <EncounterForm
          initialData={{
            encounterDate: encounter.encounterDate,
            encounterType: encounter.encounterType,
            status: encounter.status,
            provider: encounter.provider,
            reason: encounter.reason,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Encounter"
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
