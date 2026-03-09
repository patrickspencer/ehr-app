"use client";

import { useState, useRef, useEffect, useCallback, type DragEvent } from "react";
import { useTabs } from "@/contexts/TabContext";
import { getPatients } from "@/lib/api";
import { Patient } from "@/types";

function createTabDragPreview(tabElement: HTMLDivElement, label: string) {
  const rect = tabElement.getBoundingClientRect();
  const preview = document.createElement("div");

  preview.textContent = label;
  preview.style.position = "fixed";
  preview.style.top = "-1000px";
  preview.style.left = "-1000px";
  preview.style.display = "flex";
  preview.style.alignItems = "center";
  preview.style.whiteSpace = "nowrap";
  preview.style.width = `${rect.width}px`;
  preview.style.height = `${rect.height}px`;
  preview.style.margin = "0";
  preview.style.padding = "8px 16px";
  preview.style.borderRadius = "10px 10px 0 0";
  preview.style.borderBottom = "2px solid rgb(71 85 105)";
  preview.style.background = "rgb(255 255 255)";
  preview.style.color = "rgb(51 65 85)";
  preview.style.fontSize = "14px";
  preview.style.fontWeight = "500";
  preview.style.lineHeight = "20px";
  preview.style.boxSizing = "border-box";
  preview.style.pointerEvents = "none";
  preview.style.opacity = "1";
  preview.style.transform = "none";
  preview.style.boxShadow = "0 10px 24px rgba(15, 23, 42, 0.18)";
  preview.style.zIndex = "9999";

  document.body.appendChild(preview);

  return { preview, rect };
}

export default function TabBar({ onHomeClick }: { onHomeClick?: () => void }) {
  const { tabs, activeTabId, setActiveTab, closeTab, openTab, reorderTabs } = useTabs();
  const [confirmClose, setConfirmClose] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedTabId, setDraggedTabId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    patientId: number;
    position: "before" | "after";
  } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);

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

  const clearDragState = () => {
    if (dragPreviewRef.current) {
      dragPreviewRef.current.remove();
      dragPreviewRef.current = null;
    }

    setDraggedTabId(null);
    setDropTarget(null);
  };

  const handleTabDragStart = (
    event: DragEvent<HTMLDivElement>,
    patientId: number,
  ) => {
    window.getSelection()?.removeAllRanges();

    const tab = tabs.find((item) => item.patientId === patientId);
    const { preview, rect } = createTabDragPreview(
      event.currentTarget,
      tab?.patientName ?? "Patient",
    );
    const offsetX = event.clientX - rect.left || rect.width / 2;
    const offsetY = event.clientY - rect.top || rect.height / 2;

    if (dragPreviewRef.current) {
      dragPreviewRef.current.remove();
    }
    dragPreviewRef.current = preview;

    setDraggedTabId(patientId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(patientId));
    event.dataTransfer.setDragImage(preview, offsetX, offsetY);
  };

  const handleTabDragOver = (
    event: DragEvent<HTMLDivElement>,
    patientId: number,
  ) => {
    if (draggedTabId === null || draggedTabId === patientId) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const rect = event.currentTarget.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    const position = event.clientX < midpoint ? "before" : "after";

    setDropTarget((current) => {
      if (
        current?.patientId === patientId &&
        current.position === position
      ) {
        return current;
      }

      return { patientId, position };
    });
  };

  const handleTabDrop = (event: DragEvent<HTMLDivElement>, patientId: number) => {
    event.preventDefault();

    if (draggedTabId === null || draggedTabId === patientId || !dropTarget) {
      clearDragState();
      return;
    }

    reorderTabs(draggedTabId, patientId, dropTarget.position);
    clearDragState();
  };

  return (
    <>
      <div className="flex items-end border-b border-slate-700 bg-slate-300 px-4 shadow-sm">
        <button
          onClick={() => { setActiveTab(null); onHomeClick?.(); }}
          className={`-mb-px flex h-[41px] w-10 shrink-0 items-center justify-center rounded-t-lg transition-colors ${
            activeTabId === null
              ? "border-b-2 border-transparent bg-white text-slate-700"
              : "text-slate-700 hover:bg-slate-400/80 hover:text-slate-900"
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
            className={`-mb-px flex h-[41px] w-10 shrink-0 items-center justify-center rounded-t-lg transition-colors ${
              searchOpen
                ? "border-b-2 border-transparent bg-white text-slate-700"
                : "text-slate-700 hover:bg-slate-400/80 hover:text-slate-900"
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
              draggable
              onDragStart={(event) => handleTabDragStart(event, tab.patientId)}
              onDragOver={(event) => handleTabDragOver(event, tab.patientId)}
              onDrop={(event) => handleTabDrop(event, tab.patientId)}
              onDragEnd={clearDragState}
              className={`group relative -mb-px flex h-[41px] shrink-0 select-none items-center gap-1 border-b-2 px-4 text-sm font-medium transition-[transform,box-shadow,opacity,background-color,border-color,color] duration-150 ${
                activeTabId === tab.patientId
                  ? "border-transparent bg-white text-slate-700"
                  : "border-transparent text-slate-700 hover:border-slate-500 hover:bg-slate-200 hover:text-slate-900"
              } ${
                dropTarget?.patientId === tab.patientId && draggedTabId !== tab.patientId
                  ? "bg-slate-400 text-slate-900"
                  : ""
              } ${
                draggedTabId === tab.patientId
                  ? "z-10 -translate-y-0.5 cursor-grabbing bg-white shadow-md ring-1 ring-slate-300"
                  : "cursor-grab"
              }`}
              onClick={() => setActiveTab(tab.patientId)}
            >
              {dropTarget?.patientId === tab.patientId && dropTarget.position === "before" && (
                <div className="pointer-events-none absolute inset-y-1.5 -left-1 w-1 rounded-full bg-slate-600 shadow-[0_0_0_2px_rgba(249,250,251,0.95)]" />
              )}
              {dropTarget?.patientId === tab.patientId && dropTarget.position === "after" && (
                <div className="pointer-events-none absolute inset-y-1.5 -right-1 w-1 rounded-full bg-slate-600 shadow-[0_0_0_2px_rgba(249,250,251,0.95)]" />
              )}
              <span>{tab.patientName}</span>
              <button
                draggable={false}
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
