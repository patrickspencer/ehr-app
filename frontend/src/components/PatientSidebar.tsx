"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Patient, PatientAllergy, PatientCondition, PatientRisk } from "@/types";

interface PatientSidebarProps {
  patient: Patient;
  allergies: PatientAllergy[];
  conditions: PatientCondition[];
  risks: PatientRisk[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatBirthDate(value: string) {
  const date = parseDateOnly(value);
  return date ? dateFormatter.format(date) : value;
}

function calculateAge(value: string) {
  const date = parseDateOnly(value);
  if (!date) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-0.5">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </dt>
      <dd className="break-words text-[13px] text-gray-800">{value}</dd>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
      {children}
    </h3>
  );
}

function RiskRow({
  label,
  level,
  details,
}: {
  label: string;
  level: string;
  details?: string | null;
}) {
  const levelClass =
    level === "High"
      ? "bg-rose-100 text-rose-700"
      : level === "Moderate"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
      <div className="min-w-0">
        <div className="truncate text-[11px] font-medium text-slate-700">{label}</div>
        {details ? <div className="truncate text-[10px] text-slate-500">{details}</div> : null}
      </div>
      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] ${levelClass}`}>
        {level}
      </span>
    </div>
  );
}

function AllergyRow({
  allergen,
  reaction,
  severity,
}: {
  allergen: string;
  reaction?: string | null;
  severity: string;
}) {
  const severityClass =
    severity === "High"
      ? "bg-rose-100 text-rose-700"
      : severity === "Moderate"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
      <div className="min-w-0">
        <div className="truncate text-[11px] font-medium text-slate-700">{allergen}</div>
        {reaction ? (
          <div className="truncate text-[10px] text-slate-500">{reaction}</div>
        ) : null}
      </div>
      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] ${severityClass}`}>
        {severity}
      </span>
    </div>
  );
}

function ConditionRow({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  const statusClass =
    status === "Active"
      ? "bg-rose-100 text-rose-700"
      : status === "Monitoring"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
      <div className="min-w-0 truncate text-[11px] font-medium text-slate-700">{name}</div>
      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}

function getAvatarSrc(gender: string) {
  const normalized = gender.trim().toLowerCase();

  if (
    normalized === "female" ||
    normalized === "woman" ||
    normalized === "girl"
  ) {
    return "/avatars/patient-female.svg";
  }

  if (
    normalized === "male" ||
    normalized === "man" ||
    normalized === "boy"
  ) {
    return "/avatars/patient-male.svg";
  }

  return "/avatars/patient-neutral.svg";
}

function getDemoMiddleName(patient: Patient) {
  const normalized = patient.gender.trim().toLowerCase();

  const femaleNames = ["Marie", "Rose", "Elise", "Claire"];
  const maleNames = ["James", "Lee", "Thomas", "Reid"];
  const neutralNames = ["Jordan", "Taylor", "Quinn", "Reese"];

  const nameSet =
    normalized === "female" || normalized === "woman" || normalized === "girl"
      ? femaleNames
      : normalized === "male" || normalized === "man" || normalized === "boy"
        ? maleNames
        : neutralNames;

  return nameSet[patient.id % nameSet.length];
}

function getDemoMrn(patientId: number) {
  return `MRN-${String(100000 + patientId).padStart(6, "0")}`;
}

export default function PatientSidebar({
  patient,
  allergies,
  conditions,
  risks,
}: PatientSidebarProps) {
  const age = calculateAge(patient.dateOfBirth);
  const avatarSrc = getAvatarSrc(patient.gender || "");
  const middleName = getDemoMiddleName(patient);
  const mrn = getDemoMrn(patient.id);

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white lg:h-full lg:w-[14.5rem] lg:border-r lg:border-b-0 lg:overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-3 px-3 py-2.5">
          <section className="border-b border-slate-200 pb-2.5">
            <div className="grid grid-cols-[35%_1fr] items-start gap-2.5">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                <Image
                  src={avatarSrc}
                  alt={`${patient.firstName} ${patient.lastName} demo avatar`}
                  fill
                  sizes="(min-width: 1024px) 5rem, 35vw"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col self-start pt-0.5">
                <div className="space-y-1 text-[12px] font-medium leading-tight text-gray-900">
                  <div className="truncate">{patient.firstName}</div>
                  <div className="truncate text-slate-600">{middleName}</div>
                  <div className="truncate">{patient.lastName}</div>
                </div>
                <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  {mrn}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2.5">
            <SectionTitle>Patient Info</SectionTitle>
            <dl className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <DetailRow label="Birth Date" value={formatBirthDate(patient.dateOfBirth)} />
                <DetailRow
                  label="Age"
                  value={age === null ? "Not available" : `${age} years old`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <DetailRow label="Gender" value={patient.gender || "Not provided"} />
                <DetailRow label="Phone" value={patient.phone || "Not provided"} />
              </div>
              <DetailRow label="Email" value={patient.email || "Not provided"} />
              <DetailRow label="Address" value={patient.address || "Not provided"} />
            </dl>
          </section>

          <section className="space-y-2.5 border-t border-slate-200 pt-2.5">
            <SectionTitle>Risks</SectionTitle>
            {risks.length === 0 ? (
              <p className="text-[11px] text-slate-400">No flagged risks on file.</p>
            ) : (
              <div className="space-y-1.5">
                {risks.slice(0, 4).map((risk) => (
                  <RiskRow
                    key={risk.id}
                    label={risk.riskName}
                    level={risk.level}
                    details={risk.details}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2.5 border-t border-slate-200 pt-2.5">
            <SectionTitle>Allergies</SectionTitle>
            {allergies.length === 0 ? (
              <p className="text-[11px] text-slate-400">No allergies on file.</p>
            ) : (
              <div className="space-y-1.5">
                {allergies.slice(0, 4).map((allergy) => (
                  <AllergyRow
                    key={allergy.id}
                    allergen={allergy.allergen}
                    reaction={allergy.reaction}
                    severity={allergy.severity}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2.5 border-t border-slate-200 pt-2.5">
            <SectionTitle>Conditions</SectionTitle>
            {conditions.length === 0 ? (
              <p className="text-[11px] text-slate-400">No chronic conditions on file.</p>
            ) : (
              <div className="space-y-1.5">
                {conditions.slice(0, 4).map((condition) => (
                  <ConditionRow
                    key={condition.id}
                    name={condition.conditionName}
                    status={condition.status}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-500">
        v{process.env.APP_VERSION}
      </div>
    </aside>
  );
}
