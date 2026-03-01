"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTabs } from "@/contexts/TabContext";
import { getPatients } from "@/lib/api";
import { Patient } from "@/types";

export default function TabBar({ onHomeClick }: { onHomeClick?: () => void }) {
  const { tabs, activeTabId, setActiveTab, closeTab, openTab } = useTabs();
  const [confirmClose, setConfirmClose] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchPatients = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await getPatients(q || undefined);
        setPatients(results);
      } catch {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }, q ? 250 : 0);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      fetchPatients(query);
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setPatients([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [searchOpen]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    fetchPatients(value);
  };

  const handleSelectPatient = (patient: Patient) => {
    openTab({ id: patient.id, firstName: patient.firstName, lastName: patient.lastName });
    setSearchOpen(false);
  };

  return (
    <>
      <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4">
        <button
          onClick={() => { setActiveTab(null); onHomeClick?.(); }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-t-lg transition-colors ${
            activeTabId === null
              ? "bg-white text-slate-600 border-b-2 border-slate-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          title="Home"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </button>

        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-t-lg transition-colors ${
              searchOpen
                ? "bg-white text-slate-600 border-b-2 border-slate-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="Search patients"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {searchOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="p-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search patients by name..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">Loading...</div>
                ) : patients.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">No patients found</div>
                ) : (
                  patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {patient.lastName}, {patient.firstName}
                      </span>
                      <span className="text-gray-500">
                        DOB: {patient.dateOfBirth}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.patientId}
              className={`group flex shrink-0 items-center gap-1 border-b-2 px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                activeTabId === tab.patientId
                  ? "border-slate-600 bg-white text-slate-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.patientId)}
            >
              <span>{tab.patientName}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmClose(tab.patientId);
                }}
                className="ml-1 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                title="Close tab"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {confirmClose !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Close patient tab?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to close the tab for{" "}
              <span className="font-medium">
                {tabs.find((t) => t.patientId === confirmClose)?.patientName}
              </span>
              ? Any unsaved changes will be lost.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmClose(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeTab(confirmClose);
                  setConfirmClose(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Close Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
