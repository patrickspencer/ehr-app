"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Patient,
  PatientCreateRequest,
  PatientAllergy,
  PatientAllergyUpsertRequest,
  PatientCondition,
  PatientConditionUpsertRequest,
  PatientMedication,
  PatientMedicationUpsertRequest,
  PatientRisk,
  Note,
  NoteCreateRequest,
  Encounter,
  EncounterCreateRequest,
} from "@/types";
import {
  getPatient,
  updatePatient,
  getPatientAllergies,
  createPatientAllergy,
  updatePatientAllergy,
  deletePatientAllergy,
  getPatientConditions,
  createPatientCondition,
  updatePatientCondition,
  deletePatientCondition,
  getPatientMedications,
  createPatientMedication,
  updatePatientMedication,
  deletePatientMedication,
  getPatientRisks,
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
import PatientSidebar from "@/components/PatientSidebar";
import PatientSubnav, { PatientSection } from "@/components/PatientSubnav";
import PatientForm from "@/components/PatientForm";
import EncounterForm from "@/components/EncounterForm";
import { AllergyCard, ConditionCard, MedicationCard } from "@/components/PatientClinicalCards";
import EncounterList from "@/components/EncounterList";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";
import CodeList from "@/components/CodeList";
import CodeSearch from "@/components/CodeSearch";
import NoteEditor from "@/components/NoteEditor";
import { useAuth } from "@/contexts/AuthContext";

type WorkspaceView =
  | { type: "overview" }
  | { type: "editPatient" }
  | { type: "encounters" }
  | { type: "newEncounter" }
  | { type: "encounterDetail"; encounterId: number }
  | { type: "editEncounter"; encounterId: number }
  | { type: "charts" }
  | { type: "notes" };

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

function viewToSection(view: WorkspaceView): PatientSection {
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
    case "notes":
      return "notes";
  }
}

interface PatientWorkspaceProps {
  patientId: number;
}

export default function PatientWorkspace({ patientId }: PatientWorkspaceProps) {
  const { user } = useAuth();
  const [view, setView] = useState<WorkspaceView>({ type: "overview" });
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteWidthPct, setNoteWidthPct] = useState(50);
  const noteEditorGetHtml = useRef<(() => string) | null>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [conditions, setConditions] = useState<PatientCondition[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [risks, setRisks] = useState<PatientRisk[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, a, c, m, r, n, e] = await Promise.all([
          getPatient(patientId),
          getPatientAllergies(patientId),
          getPatientConditions(patientId),
          getPatientMedications(patientId),
          getPatientRisks(patientId),
          getNotes(patientId),
          getEncounters(patientId),
        ]);
        setPatient(p);
        setAllergies(a);
        setConditions(c);
        setMedications(m);
        setRisks(r);
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

  async function handleUpdatePatient(data: PatientCreateRequest) {
    const updated = await updatePatient(patientId, data);
    setPatient(updated);
    setView({ type: "overview" });
  }

  async function handleAddNote(data: NoteCreateRequest) {
    const note = await createNote(patientId, data);
    setNotes((prev) => [note, ...prev]);
  }

  async function handleCreateAllergy(data: PatientAllergyUpsertRequest) {
    const allergy = await createPatientAllergy(patientId, data);
    setAllergies((prev) => [...prev, allergy]);
  }

  async function handleUpdateAllergy(id: number, data: PatientAllergyUpsertRequest) {
    const allergy = await updatePatientAllergy(patientId, id, data);
    setAllergies((prev) => prev.map((item) => (item.id === id ? allergy : item)));
  }

  async function handleDeleteAllergy(id: number) {
    await deletePatientAllergy(patientId, id);
    setAllergies((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleCreateCondition(data: PatientConditionUpsertRequest) {
    const condition = await createPatientCondition(patientId, data);
    setConditions((prev) => [...prev, condition]);
  }

  async function handleUpdateCondition(id: number, data: PatientConditionUpsertRequest) {
    const condition = await updatePatientCondition(patientId, id, data);
    setConditions((prev) => prev.map((item) => (item.id === id ? condition : item)));
  }

  async function handleDeleteCondition(id: number) {
    await deletePatientCondition(patientId, id);
    setConditions((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleCreateMedication(data: PatientMedicationUpsertRequest) {
    const medication = await createPatientMedication(patientId, data);
    setMedications((prev) => [...prev, medication]);
  }

  async function handleUpdateMedication(id: number, data: PatientMedicationUpsertRequest) {
    const medication = await updatePatientMedication(patientId, id, data);
    setMedications((prev) => prev.map((item) => (item.id === id ? medication : item)));
  }

  async function handleDeleteMedication(id: number) {
    await deletePatientMedication(patientId, id);
    setMedications((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleCreateEncounter(data: EncounterCreateRequest) {
    const enc = await createEncounter(patientId, data);
    setEncounters((prev) => [...prev, enc]);
    setView({ type: "encounters" });
  }

  function handleViewEncounter(encounterId: number) {
    setView({ type: "encounterDetail", encounterId });
  }

  function handleSectionNavigate(section: PatientSection) {
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
      case "notes":
        setView({ type: "notes" });
        break;
    }
  }

  function handleDragStart(e: React.MouseEvent) {
    e.preventDefault();
    dragging.current = true;
    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setNoteWidthPct(Math.min(80, Math.max(20, 100 - pct)));
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
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
    <div className="flex h-[calc(100vh-5rem)] flex-col bg-gray-50 lg:flex-row">
      <PatientSidebar
        patient={patient}
        allergies={allergies}
        conditions={conditions}
        risks={risks}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-end border-b border-slate-300 bg-slate-100 shadow-sm">
          <PatientSubnav
            activeSection={viewToSection(view)}
            onNavigate={handleSectionNavigate}
          />
          <button
            onClick={() => setNoteOpen(true)}
            className="my-1.5 ml-2 shrink-0 rounded-md bg-slate-600 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
          >
            + Note
          </button>
        </div>
        <div ref={splitRef} className={`min-h-0 flex-1 ${noteOpen ? "flex" : ""}`}>
          <div
            className={`overflow-y-auto px-3 pt-3 pb-5 ${noteOpen ? "min-w-0" : "h-full"}`}
            style={noteOpen ? { width: `${100 - noteWidthPct}%` } : undefined}
          >
            <WorkspaceContent
              view={view}
              setView={setView}
              patient={patient}
              allergies={allergies}
              conditions={conditions}
              medications={medications}
              notes={notes}
              encounters={encounters}
              patientId={patientId}
              onUpdatePatient={handleUpdatePatient}
              onCreateAllergy={handleCreateAllergy}
              onUpdateAllergy={handleUpdateAllergy}
              onDeleteAllergy={handleDeleteAllergy}
              onCreateCondition={handleCreateCondition}
              onUpdateCondition={handleUpdateCondition}
              onDeleteCondition={handleDeleteCondition}
              onCreateMedication={handleCreateMedication}
              onUpdateMedication={handleUpdateMedication}
              onDeleteMedication={handleDeleteMedication}
              onAddNote={handleAddNote}
              onCreateEncounter={handleCreateEncounter}
              onViewEncounter={handleViewEncounter}
              onEncountersChanged={setEncounters}
            />
          </div>
          {noteOpen && (
            <>
              <div
                onMouseDown={handleDragStart}
                className="w-1 shrink-0 cursor-col-resize bg-gray-200 hover:bg-blue-400 transition-colors"
              />
              <div
                className="flex min-w-0 flex-col overflow-hidden"
                style={{ width: `${noteWidthPct}%` }}
              >
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
                  <h2 className="text-sm font-semibold text-gray-900">Note</h2>
                  <button
                    onClick={() => setNoteOpen(false)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <NoteEditor onGetEditor={(getHtml) => { noteEditorGetHtml.current = getHtml; }} />
                <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3">
                  <button className="rounded-md bg-slate-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
                    Save
                  </button>
                  <button
                    onClick={async () => {
                      const html = noteEditorGetHtml.current?.() ?? "";
                      if (!html || html === "<p></p>") return;
                      const authorName = user ? `${user.firstName} ${user.lastName}` : "Unknown";
                      await handleAddNote({ content: html, author: authorName });
                      setNoteOpen(false);
                    }}
                    className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Sign
                  </button>
                  <button
                    onClick={() => setNoteOpen(false)}
                    className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Renders the content area based on current view
function WorkspaceContent({
  view,
  setView,
  patient,
  allergies,
  conditions,
  medications,
  notes,
  encounters,
  patientId,
  onUpdatePatient,
  onCreateAllergy,
  onUpdateAllergy,
  onDeleteAllergy,
  onCreateCondition,
  onUpdateCondition,
  onDeleteCondition,
  onCreateMedication,
  onUpdateMedication,
  onDeleteMedication,
  onAddNote,
  onCreateEncounter,
  onViewEncounter,
  onEncountersChanged,
}: {
  view: WorkspaceView;
  setView: (v: WorkspaceView) => void;
  patient: Patient;
  allergies: PatientAllergy[];
  conditions: PatientCondition[];
  medications: PatientMedication[];
  notes: Note[];
  encounters: Encounter[];
  patientId: number;
  onUpdatePatient: (data: PatientCreateRequest) => Promise<void>;
  onCreateAllergy: (data: PatientAllergyUpsertRequest) => Promise<void>;
  onUpdateAllergy: (id: number, data: PatientAllergyUpsertRequest) => Promise<void>;
  onDeleteAllergy: (id: number) => Promise<void>;
  onCreateCondition: (data: PatientConditionUpsertRequest) => Promise<void>;
  onUpdateCondition: (id: number, data: PatientConditionUpsertRequest) => Promise<void>;
  onDeleteCondition: (id: number) => Promise<void>;
  onCreateMedication: (data: PatientMedicationUpsertRequest) => Promise<void>;
  onUpdateMedication: (id: number, data: PatientMedicationUpsertRequest) => Promise<void>;
  onDeleteMedication: (id: number) => Promise<void>;
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
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Encounters</h1>
          <button
            onClick={() => setView({ type: "newEncounter" })}
            className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
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

  if (view.type === "notes") {
    return (
      <div className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-400">No notes yet.</p>
        ) : (
          <NoteList notes={notes} />
        )}
      </div>
    );
  }

  if (view.type === "charts") {
    return (
      <div className="max-w-3xl">
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

  // Patient Chart (overview)
  return (
    <div className="space-y-6">
      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Encounters */}
        <div className="overflow-hidden rounded-lg border border-gray-200 border-t-4 border-t-blue-400 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 bg-slate-50 px-3.5 py-2">
            <h2 className="text-sm font-semibold tracking-wide text-gray-900">Recent Encounters</h2>
            <button
              onClick={() => setView({ type: "encounters" })}
              className="text-xs font-medium text-blue-700 transition-colors hover:text-blue-900"
            >
              View all
            </button>
          </div>
          <div className="p-3.5">
            {encounters.length === 0 ? (
              <p className="text-sm text-gray-400">No encounters yet.</p>
            ) : (
              <EncounterList
                encounters={encounters.slice(0, 3)}
                patientId={patientId}
                onView={onViewEncounter}
                compact
              />
            )}
          </div>
        </div>

        <AllergyCard
          allergies={allergies}
          onCreate={onCreateAllergy}
          onUpdate={onUpdateAllergy}
          onDelete={onDeleteAllergy}
        />

        <MedicationCard
          medications={medications}
          onCreate={onCreateMedication}
          onUpdate={onUpdateMedication}
          onDelete={onDeleteMedication}
        />

        <ConditionCard
          conditions={conditions}
          onCreate={onCreateCondition}
          onUpdate={onUpdateCondition}
          onDelete={onDeleteCondition}
        />

        {/* Clinical Notes */}
        <div className="overflow-hidden rounded-lg border border-gray-200 border-t-4 border-t-cyan-400 bg-white">
          <div className="border-b border-gray-200 bg-slate-50 px-3.5 py-2">
            <h2 className="text-sm font-semibold tracking-wide text-gray-900">Clinical Notes</h2>
          </div>
          <div className="p-3.5">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-400">No notes yet.</p>
            ) : (
              <NoteList notes={notes} />
            )}
            <div className="mt-2.5 border-t border-gray-100 pt-2.5">
              <NoteForm onSubmit={onAddNote} />
            </div>
          </div>
        </div>
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
    setNotes((prev) => [note, ...prev]);
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
            <button onClick={onBack} className="text-sm text-slate-600 hover:text-slate-800">
              &larr; Back to Encounters
            </button>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {typeLabels[encounter.encounterType] || encounter.encounterType}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
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
