"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Tab {
  patientId: number;
  patientName: string;
}

interface TabContextValue {
  tabs: Tab[];
  activeTabId: number | null;
  openTab: (patient: { id: number; firstName: string; lastName: string }) => void;
  closeTab: (patientId: number) => void;
  setActiveTab: (id: number | null) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

  const openTab = useCallback((patient: { id: number; firstName: string; lastName: string }) => {
    setTabs((prev) => {
      if (prev.some((t) => t.patientId === patient.id)) return prev;
      return [...prev, { patientId: patient.id, patientName: `${patient.firstName} ${patient.lastName}` }];
    });
    setActiveTabId(patient.id);
  }, []);

  const closeTab = useCallback((patientId: number) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.patientId === patientId);
      const next = prev.filter((t) => t.patientId !== patientId);
      setActiveTabId((current) => {
        if (current !== patientId) return current;
        if (next.length === 0) return null;
        const newIdx = Math.min(idx, next.length - 1);
        return next[newIdx].patientId;
      });
      return next;
    });
  }, []);

  const setActiveTab = useCallback((id: number | null) => {
    setActiveTabId(id);
  }, []);

  return (
    <TabContext.Provider value={{ tabs, activeTabId, openTab, closeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTabs must be used within a TabProvider");
  return ctx;
}
