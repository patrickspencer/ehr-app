"use client";

import { useState } from "react";
import { useTabs } from "@/contexts/TabContext";

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabs();
  const [confirmClose, setConfirmClose] = useState<number | null>(null);

  if (tabs.length === 0) return null;

  return (
    <>
      <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4">
        <button
          onClick={() => setActiveTab(null)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-t-lg transition-colors ${
            activeTabId === null
              ? "bg-white text-teal-600 border-b-2 border-teal-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          title="Find Patient"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </button>
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.patientId}
              className={`group flex shrink-0 items-center gap-1 border-b-2 px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                activeTabId === tab.patientId
                  ? "border-teal-600 bg-white text-teal-700"
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
