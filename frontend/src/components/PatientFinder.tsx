"use client";

import { useEffect, useState } from "react";
import { Patient, PatientCreateRequest } from "@/types";
import { getPatients, deletePatient, createPatient } from "@/lib/api";
import { useTabs } from "@/contexts/TabContext";
import SearchBar from "@/components/SearchBar";
import PatientTable from "@/components/PatientTable";
import PatientForm from "@/components/PatientForm";

export default function PatientFinder() {
  const { openTab } = useTabs();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPatients(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  async function fetchPatients(q: string) {
    setLoading(true);
    try {
      const data = await getPatients(q || undefined);
      setPatients(data);
    } catch {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete patient.");
    }
  }

  async function handleCreate(data: PatientCreateRequest) {
    const patient = await createPatient(data);
    setShowNewForm(false);
    openTab(patient);
  }

  if (showNewForm) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Add Patient</h1>
          <button
            onClick={() => setShowNewForm(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <PatientForm onSubmit={handleCreate} submitLabel="Create Patient" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          Add Patient
        </button>
      </div>
      <SearchBar value={query} onChange={setQuery} />
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <PatientTable patients={patients} onDelete={handleDelete} />
      )}
    </div>
  );
}
