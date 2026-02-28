"use client";

import { useTabs } from "@/contexts/TabContext";
import TabBar from "@/components/TabBar";
import PatientFinder from "@/components/PatientFinder";
import PatientWorkspace from "@/components/PatientWorkspace";

export default function Home() {
  const { activeTabId } = useTabs();

  return (
    <div>
      <TabBar />
      {activeTabId === null ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PatientFinder />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PatientWorkspace key={activeTabId} patientId={activeTabId} />
        </div>
      )}
    </div>
  );
}
