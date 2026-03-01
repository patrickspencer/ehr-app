"use client";

import Link from "next/link";
import { Encounter } from "@/types";

interface EncounterListProps {
  encounters: Encounter[];
  patientId: number;
  onView?: (encounterId: number) => void;
  compact?: boolean;
}

const statusColors: Record<string, string> = {
  PLANNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

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

export default function EncounterList({ encounters, patientId, onView, compact }: EncounterListProps) {
  if (encounters.length === 0) {
    return <p className="text-gray-500 text-sm">No encounters yet.</p>;
  }

  if (compact) {
    return (
      <ul className="divide-y divide-gray-100">
        {encounters.map((enc) => (
          <li key={enc.id} className="flex items-center justify-between py-2.5">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {typeLabels[enc.encounterType] || enc.encounterType}
              </p>
              <p className="text-xs text-gray-500">{enc.encounterDate} &middot; {enc.provider}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[enc.status] || "bg-gray-100 text-gray-700"}`}>
                {enc.status}
              </span>
              {onView && (
                <button onClick={() => onView(enc.id)} className="text-xs font-medium text-slate-600 hover:text-slate-800">
                  View
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Provider</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Codes</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {encounters.map((enc) => (
            <tr key={enc.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{enc.encounterDate}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {typeLabels[enc.encounterType] || enc.encounterType}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{enc.provider}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[enc.status] || "bg-gray-100 text-gray-700"}`}>
                  {enc.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {enc.diagnoses.length + enc.procedures.length} codes
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                {onView ? (
                  <button
                    onClick={() => onView(enc.id)}
                    className="text-sm font-medium text-slate-600 hover:text-slate-800"
                  >
                    View
                  </button>
                ) : (
                  <Link
                    href={`/patients/${patientId}/encounters/${enc.id}`}
                    className="text-sm font-medium text-slate-600 hover:text-slate-800"
                  >
                    View
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
