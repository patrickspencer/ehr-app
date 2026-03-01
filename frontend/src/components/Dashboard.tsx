"use client";

import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  onOpenFinder: () => void;
}

export default function Dashboard({ onOpenFinder }: DashboardProps) {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user?.firstName}
      </h1>
      <p className="mt-1 text-sm text-gray-500">What would you like to do today?</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <button
          onClick={onOpenFinder}
          className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 text-left"
        >
          <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-900">Find Patient</span>
            <p className="mt-1 text-xs text-gray-500">Search and open a patient chart</p>
          </div>
        </button>

        <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-900">Upcoming Appointments</span>
            <p className="mt-1 text-xs text-gray-500">No upcoming appointments</p>
            <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 uppercase">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
