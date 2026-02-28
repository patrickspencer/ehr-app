"use client";

import { useRouter } from "next/navigation";
import { createPatient } from "@/lib/api";
import { PatientCreateRequest } from "@/types";
import PatientForm from "@/components/PatientForm";

export default function NewPatientPage() {
  const router = useRouter();

  async function handleSubmit(data: PatientCreateRequest) {
    await createPatient(data);
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add Patient</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <PatientForm onSubmit={handleSubmit} submitLabel="Create Patient" />
      </div>
    </div>
  );
}
