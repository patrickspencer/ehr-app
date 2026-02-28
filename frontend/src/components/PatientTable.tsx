"use client";

import { Patient } from "@/types";
import { useTabs } from "@/contexts/TabContext";

interface PatientTableProps {
  patients: Patient[];
  onDelete: (id: number) => void;
}

export default function PatientTable({ patients, onDelete }: PatientTableProps) {
  const { openTab } = useTabs();

  function handleDelete(id: number, name: string) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  }

  if (patients.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No patients found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Date of Birth</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => openTab(patient)}
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.dateOfBirth}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.gender}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.phone}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.email}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTab(patient);
                    }}
                    className="text-teal-600 hover:text-teal-800 font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(patient.id, `${patient.firstName} ${patient.lastName}`);
                    }}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
