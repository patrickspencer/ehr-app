"use client";

import { useParams, useRouter } from "next/navigation";
import { EncounterCreateRequest } from "@/types";
import { createEncounter } from "@/lib/api";
import EncounterForm from "@/components/EncounterForm";

export default function NewEncounterPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params.id);

  async function handleSubmit(data: EncounterCreateRequest) {
    await createEncounter(patientId, data);
    router.push(`/patients/${patientId}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New Encounter</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <EncounterForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
