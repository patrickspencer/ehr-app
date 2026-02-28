"use client";

import { useTabs } from "@/contexts/TabContext";

export default function Navbar() {
  const { setActiveTab } = useTabs();

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <button
            onClick={() => setActiveTab(null)}
            className="text-xl font-bold tracking-wide hover:text-teal-100 transition-colors"
          >
            EHR
          </button>
        </div>
      </div>
    </nav>
  );
}
