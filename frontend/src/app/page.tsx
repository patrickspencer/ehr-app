"use client";

import { useState, useEffect } from "react";
import { useTabs } from "@/contexts/TabContext";
import TabBar from "@/components/TabBar";
import PatientFinder from "@/components/PatientFinder";
import PatientWorkspace from "@/components/PatientWorkspace";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { activeTabId } = useTabs();
  const [showFinder, setShowFinder] = useState(false);

  useEffect(() => {
    setShowFinder(false);
  }, [activeTabId]);

  return (
    <div>
      <TabBar onHomeClick={() => setShowFinder(false)} />
      {activeTabId !== null ? (
        <PatientWorkspace key={activeTabId} patientId={activeTabId} />
      ) : showFinder ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowFinder(false)}
            className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <PatientFinder />
        </div>
      ) : (
        <Dashboard onOpenFinder={() => setShowFinder(true)} />
      )}
    </div>
  );
}
