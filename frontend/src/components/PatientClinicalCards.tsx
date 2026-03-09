"use client";

import { useState, type ReactNode } from "react";
import {
  PatientAllergy,
  PatientAllergyUpsertRequest,
  PatientCondition,
  PatientConditionUpsertRequest,
  PatientMedication,
  PatientMedicationUpsertRequest,
} from "@/types";

const allergyEmpty: PatientAllergyUpsertRequest = {
  allergen: "",
  reaction: "",
  severity: "Moderate",
  notedAt: "",
};

const conditionEmpty: PatientConditionUpsertRequest = {
  conditionName: "",
  icd10Code: "",
  status: "Active",
  diagnosedAt: "",
  notes: "",
};

const medicationEmpty: PatientMedicationUpsertRequest = {
  medicationName: "",
  dose: "",
  route: "",
  frequency: "",
  status: "Active",
  startedAt: "",
  instructions: "",
};

function SmallBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${className}`}>
      {label}
    </span>
  );
}

function SectionHeader({
  title,
  count,
  actionLabel,
  onAction,
}: {
  title: string;
  count: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-slate-50 px-3.5 py-2">
      <h2 className="text-sm font-semibold tracking-wide text-gray-900">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium text-slate-500">{count}</span>
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-medium text-slate-600 transition-colors hover:text-slate-800"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 text-xs font-medium">
      <button type="button" onClick={onEdit} className="text-slate-600 hover:text-slate-800">
        Edit
      </button>
      <button type="button" onClick={onDelete} className="text-rose-600 hover:text-rose-700">
        Delete
      </button>
    </div>
  );
}

function FormActions({
  submitting,
  submitLabel,
  onCancel,
}: {
  submitting: boolean;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}

function FormShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-slate-50 p-3">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function allergyBadgeClass(severity: string) {
  if (severity === "High") return "bg-rose-100 text-rose-700";
  if (severity === "Moderate") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function conditionBadgeClass(status: string) {
  if (status === "Active") return "bg-rose-100 text-rose-700";
  if (status === "Monitoring") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function medicationBadgeClass(status: string) {
  if (status === "PRN") return "bg-sky-100 text-sky-700";
  if (status === "Stopped") return "bg-slate-100 text-slate-600";
  return "bg-emerald-100 text-emerald-700";
}

export function AllergyCard({
  allergies,
  onCreate,
  onUpdate,
  onDelete,
}: {
  allergies: PatientAllergy[];
  onCreate: (data: PatientAllergyUpsertRequest) => Promise<void>;
  onUpdate: (id: number, data: PatientAllergyUpsertRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PatientAllergyUpsertRequest>(allergyEmpty);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startCreate() {
    setIsOpen(true);
    setEditingId(null);
    setDraft({ ...allergyEmpty });
  }

  function startEdit(allergy: PatientAllergy) {
    setIsOpen(true);
    setEditingId(allergy.id);
    setDraft({
      allergen: allergy.allergen,
      reaction: allergy.reaction || "",
      severity: allergy.severity,
      notedAt: allergy.notedAt || "",
    });
  }

  function cancel() {
    setIsOpen(false);
    setEditingId(null);
    setDraft({ ...allergyEmpty });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.allergen.trim()) return;
    setSubmitting(true);
    try {
      if (editingId === null) {
        await onCreate(draft);
      } else {
        await onUpdate(editingId, draft);
      }
      cancel();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this allergy?")) return;
    await onDelete(id);
    if (editingId === id) cancel();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 border-t-4 border-t-amber-400 bg-white">
      <SectionHeader
        title="Allergies"
        count={`${allergies.length} on file`}
        actionLabel={editingId === null && !isOpen ? "Add allergy" : "New"}
        onAction={startCreate}
      />
      <div className="p-3.5">
        {allergies.length === 0 ? (
          <p className="text-sm text-gray-400">No allergies on file.</p>
        ) : (
          <div className="space-y-2.5">
            {allergies.map((allergy) => (
              <div key={allergy.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">{allergy.allergen}</p>
                  <p className="truncate text-xs text-slate-500">
                    {allergy.reaction || "Reaction not recorded"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <SmallBadge label={allergy.severity} className={allergyBadgeClass(allergy.severity)} />
                  <RowActions onEdit={() => startEdit(allergy)} onDelete={() => handleDelete(allergy.id)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && (
          <FormShell title={editingId === null ? "Add Allergy" : "Edit Allergy"}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Allergen</label>
                  <input
                    type="text"
                    required
                    value={draft.allergen}
                    onChange={(event) => setDraft((prev) => ({ ...prev, allergen: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Severity</label>
                  <select
                    value={draft.severity}
                    onChange={(event) => setDraft((prev) => ({ ...prev, severity: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Reaction</label>
                  <input
                    type="text"
                    value={draft.reaction}
                    onChange={(event) => setDraft((prev) => ({ ...prev, reaction: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Noted Date</label>
                  <input
                    type="date"
                    value={draft.notedAt}
                    onChange={(event) => setDraft((prev) => ({ ...prev, notedAt: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>
              <FormActions
                submitting={submitting}
                submitLabel={editingId === null ? "Add Allergy" : "Update Allergy"}
                onCancel={cancel}
              />
            </form>
          </FormShell>
        )}
      </div>
    </div>
  );
}

export function ConditionCard({
  conditions,
  onCreate,
  onUpdate,
  onDelete,
}: {
  conditions: PatientCondition[];
  onCreate: (data: PatientConditionUpsertRequest) => Promise<void>;
  onUpdate: (id: number, data: PatientConditionUpsertRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PatientConditionUpsertRequest>(conditionEmpty);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startCreate() {
    setIsOpen(true);
    setEditingId(null);
    setDraft({ ...conditionEmpty });
  }

  function startEdit(condition: PatientCondition) {
    setIsOpen(true);
    setEditingId(condition.id);
    setDraft({
      conditionName: condition.conditionName,
      icd10Code: condition.icd10Code || "",
      status: condition.status,
      diagnosedAt: condition.diagnosedAt || "",
      notes: condition.notes || "",
    });
  }

  function cancel() {
    setIsOpen(false);
    setEditingId(null);
    setDraft({ ...conditionEmpty });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.conditionName.trim()) return;
    setSubmitting(true);
    try {
      if (editingId === null) {
        await onCreate(draft);
      } else {
        await onUpdate(editingId, draft);
      }
      cancel();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this condition?")) return;
    await onDelete(id);
    if (editingId === id) cancel();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 border-t-4 border-t-violet-400 bg-white">
      <SectionHeader
        title="Conditions"
        count={`${conditions.length} tracked`}
        actionLabel="Add condition"
        onAction={startCreate}
      />
      <div className="p-3.5">
        {conditions.length === 0 ? (
          <p className="text-sm text-gray-400">No chronic conditions on file.</p>
        ) : (
          <div className="space-y-2.5">
            {conditions.map((condition) => (
              <div key={condition.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">{condition.conditionName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {condition.icd10Code ? `ICD-10 ${condition.icd10Code}` : "No code"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <SmallBadge label={condition.status} className={conditionBadgeClass(condition.status)} />
                  <RowActions onEdit={() => startEdit(condition)} onDelete={() => handleDelete(condition.id)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && (
          <FormShell title={editingId === null ? "Add Condition" : "Edit Condition"}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Condition</label>
                  <input
                    type="text"
                    required
                    value={draft.conditionName}
                    onChange={(event) => setDraft((prev) => ({ ...prev, conditionName: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">ICD-10</label>
                  <input
                    type="text"
                    value={draft.icd10Code}
                    onChange={(event) => setDraft((prev) => ({ ...prev, icd10Code: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Stable">Stable</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Diagnosed Date</label>
                  <input
                    type="date"
                    value={draft.diagnosedAt}
                    onChange={(event) => setDraft((prev) => ({ ...prev, diagnosedAt: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  rows={3}
                  value={draft.notes}
                  onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <FormActions
                submitting={submitting}
                submitLabel={editingId === null ? "Add Condition" : "Update Condition"}
                onCancel={cancel}
              />
            </form>
          </FormShell>
        )}
      </div>
    </div>
  );
}

export function MedicationCard({
  medications,
  onCreate,
  onUpdate,
  onDelete,
}: {
  medications: PatientMedication[];
  onCreate: (data: PatientMedicationUpsertRequest) => Promise<void>;
  onUpdate: (id: number, data: PatientMedicationUpsertRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PatientMedicationUpsertRequest>(medicationEmpty);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startCreate() {
    setIsOpen(true);
    setEditingId(null);
    setDraft({ ...medicationEmpty });
  }

  function startEdit(medication: PatientMedication) {
    setIsOpen(true);
    setEditingId(medication.id);
    setDraft({
      medicationName: medication.medicationName,
      dose: medication.dose || "",
      route: medication.route || "",
      frequency: medication.frequency || "",
      status: medication.status,
      startedAt: medication.startedAt || "",
      instructions: medication.instructions || "",
    });
  }

  function cancel() {
    setIsOpen(false);
    setEditingId(null);
    setDraft({ ...medicationEmpty });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.medicationName.trim()) return;
    setSubmitting(true);
    try {
      if (editingId === null) {
        await onCreate(draft);
      } else {
        await onUpdate(editingId, draft);
      }
      cancel();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this medication?")) return;
    await onDelete(id);
    if (editingId === id) cancel();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 border-t-4 border-t-emerald-400 bg-white">
      <SectionHeader
        title="Medications"
        count={`${medications.length} active`}
        actionLabel="Add medication"
        onAction={startCreate}
      />
      <div className="p-3.5">
        {medications.length === 0 ? (
          <p className="text-sm text-gray-400">No active medications.</p>
        ) : (
          <div className="space-y-2.5">
            {medications.map((medication) => (
              <div key={medication.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">{medication.medicationName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {[medication.dose, medication.frequency].filter(Boolean).join(" · ") || "No dosing details"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <SmallBadge label={medication.status} className={medicationBadgeClass(medication.status)} />
                  <RowActions onEdit={() => startEdit(medication)} onDelete={() => handleDelete(medication.id)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && (
          <FormShell title={editingId === null ? "Add Medication" : "Edit Medication"}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Medication</label>
                  <input
                    type="text"
                    required
                    value={draft.medicationName}
                    onChange={(event) => setDraft((prev) => ({ ...prev, medicationName: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Dose</label>
                  <input
                    type="text"
                    value={draft.dose}
                    onChange={(event) => setDraft((prev) => ({ ...prev, dose: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Route</label>
                  <input
                    type="text"
                    value={draft.route}
                    onChange={(event) => setDraft((prev) => ({ ...prev, route: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Frequency</label>
                  <input
                    type="text"
                    value={draft.frequency}
                    onChange={(event) => setDraft((prev) => ({ ...prev, frequency: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="Active">Active</option>
                    <option value="PRN">PRN</option>
                    <option value="Stopped">Stopped</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Started Date</label>
                  <input
                    type="date"
                    value={draft.startedAt}
                    onChange={(event) => setDraft((prev) => ({ ...prev, startedAt: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Instructions</label>
                  <input
                    type="text"
                    value={draft.instructions}
                    onChange={(event) => setDraft((prev) => ({ ...prev, instructions: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>
              <FormActions
                submitting={submitting}
                submitLabel={editingId === null ? "Add Medication" : "Update Medication"}
                onCancel={cancel}
              />
            </form>
          </FormShell>
        )}
      </div>
    </div>
  );
}
