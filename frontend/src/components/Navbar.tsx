"use client";

import { useTabs } from "@/contexts/TabContext";
import { useAuth } from "@/contexts/AuthContext";

const roleLabels: Record<string, string> = {
  DOCTOR: "Physician",
  NURSE: "Nurse",
  OFFICE: "Office Staff",
};

export default function Navbar() {
  const { setActiveTab } = useTabs();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-teal-600 text-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-10 items-center justify-between">
          <button
            onClick={() => setActiveTab(null)}
            className="text-base font-bold tracking-wide hover:text-teal-100 transition-colors"
          >
            EHR
          </button>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-teal-100">
                {user.title
                  ? `${user.firstName} ${user.lastName}, ${user.title}`
                  : `${user.firstName} ${user.lastName}`}
                <span className="ml-1.5 rounded bg-teal-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                  {roleLabels[user.role] || user.role}
                </span>
              </span>
              <button
                onClick={logout}
                className="rounded px-2 py-0.5 text-xs font-medium text-teal-200 hover:bg-teal-700 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
