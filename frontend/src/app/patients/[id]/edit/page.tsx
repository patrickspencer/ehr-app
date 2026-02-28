"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Patient, PatientCreateRequest } from "@/types";
import { getPatient, updatePatient } from "@/lib/api";
import PatientForm from "@/components/PatientForm";

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await getPatient(id);
        setPatient(p);
      } catch {
        setPatient(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(data: PatientCreateRequest) {
    await updatePatient(id, data);
    router.push(`/patients/${id}`);
  }

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (!patient) return <p className="text-center text-red-500 py-8">Patient not found.</p>;

  const initialData: PatientCreateRequest = {
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Edit Patient: {patient.firstName} {patient.lastName}
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <PatientForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Patient" />
      </div>
    </div>
  );
}
