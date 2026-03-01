"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from "react";

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

function storageKey(userId: number) {
  return `ehr_tabs_${userId}`;
}

function loadTabs(userId: number): { tabs: Tab[]; activeTabId: number | null } {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.tabs)) {
        return { tabs: parsed.tabs, activeTabId: parsed.activeTabId ?? null };
      }
    }
  } catch { /* ignore corrupt data */ }
  return { tabs: [], activeTabId: null };
}

function saveTabs(userId: number, tabs: Tab[], activeTabId: number | null) {
  localStorage.setItem(storageKey(userId), JSON.stringify({ tabs, activeTabId }));
}

export function TabProvider({ userId, children }: { userId: number; children: ReactNode }) {
  const initial = useRef(loadTabs(userId));
  const [tabs, setTabs] = useState<Tab[]>(initial.current.tabs);
  const [activeTabId, setActiveTabId] = useState<number | null>(initial.current.activeTabId);

  useEffect(() => {
    saveTabs(userId, tabs, activeTabId);
  }, [userId, tabs, activeTabId]);

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
