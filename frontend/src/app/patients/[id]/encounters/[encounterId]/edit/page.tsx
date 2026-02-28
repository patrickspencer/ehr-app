"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Encounter, EncounterCreateRequest } from "@/types";
import { getEncounter, updateEncounter } from "@/lib/api";
import EncounterForm from "@/components/EncounterForm";

export default function EditEncounterPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params.id);
  const encounterId = Number(params.encounterId);

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
    await updateEncounter(patientId, encounterId, data);
    router.push(`/patients/${patientId}/encounters/${encounterId}`);
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
        />
      </div>
    </div>
  );
}
