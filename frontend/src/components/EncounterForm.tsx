"use client";

import { useState } from "react";
import { EncounterCreateRequest } from "@/types";

interface EncounterFormProps {
  initialData?: EncounterCreateRequest;
  onSubmit: (data: EncounterCreateRequest) => Promise<void>;
  submitLabel?: string;
  onCancel?: () => void;
}

const encounterTypes = [
  { value: "OFFICE_VISIT", label: "Office Visit" },
  { value: "ANNUAL_EXAM", label: "Annual Exam" },
  { value: "NEW_PATIENT", label: "New Patient" },
  { value: "FOLLOW_UP", label: "Follow-Up" },
  { value: "URGENT_CARE", label: "Urgent Care" },
  { value: "TELEHEALTH", label: "Telehealth" },
  { value: "EMERGENCY", label: "Emergency" },
  { value: "PROCEDURE", label: "Procedure" },
];

const statusOptions = [
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function EncounterForm({ initialData, onSubmit, submitLabel = "Create Encounter", onCancel }: EncounterFormProps) {
  const [form, setForm] = useState<EncounterCreateRequest>(
    initialData || {
      encounterDate: new Date().toISOString().split("T")[0],
      encounterType: "OFFICE_VISIT",
      status: "PLANNED",
      provider: "",
      reason: "",
    }
  );
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, reason: form.reason || null });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="encounterDate"
            required
            value={form.encounterDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="encounterType"
            required
            value={form.encounterType}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          >
            {encounterTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
          <input
            type="text"
            name="provider"
            required
            value={form.provider}
            onChange={handleChange}
            placeholder="e.g. Dr. Smith"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            required
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
        <textarea
          name="reason"
          rows={3}
          value={form.reason || ""}
          onChange={handleChange}
          placeholder="Describe the reason for this encounter..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
