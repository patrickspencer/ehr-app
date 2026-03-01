"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { getUsers } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const roleLabels: Record<string, string> = {
  DOCTOR: "Physician",
  NURSE: "Nurse",
  OFFICE: "Office Staff",
};

const roleColors: Record<string, string> = {
  DOCTOR: "bg-slate-100 text-slate-800",
  NURSE: "bg-blue-100 text-blue-800",
  OFFICE: "bg-amber-100 text-amber-800",
};

const roleIcons: Record<string, React.ReactNode> = {
  DOCTOR: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  NURSE: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  OFFICE: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped: Record<string, User[]> = {};
  for (const u of users) {
    (grouped[u.role] ??= []).push(u);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-700">EHR</h1>
          <p className="mt-1 text-sm text-gray-500">Select a user to sign in</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <div className="space-y-6">
            {["DOCTOR", "NURSE", "OFFICE"].map((role) => {
              const group = grouped[role];
              if (!group?.length) return null;
              return (
                <div key={role}>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {roleLabels[role]}s
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {group.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => login(u)}
                        className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${roleColors[u.role]}`}>
                          {roleIcons[u.role]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {u.title ? `${u.firstName} ${u.lastName}, ${u.title}` : `${u.firstName} ${u.lastName}`}
                          </p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
