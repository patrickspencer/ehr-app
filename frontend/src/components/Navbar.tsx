"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getUsers } from "@/lib/api";
import { useTabs } from "@/contexts/TabContext";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";

const roleLabels: Record<string, string> = {
  DOCTOR: "Physician",
  NURSE: "Nurse",
  OFFICE: "Office Staff",
};

export default function Navbar() {
  const { setActiveTab } = useTabs();
  const { user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;

    getUsers()
      .then((loadedUsers) => {
        if (!ignore) setUsers(loadedUsers);
      })
      .catch(() => {
        if (!ignore) setUsers([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const otherUsers = user
    ? users.filter((candidate) => candidate.id !== user.id)
    : [];

  return (
    <nav className="border-b border-slate-700 bg-slate-600 text-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-10 items-center justify-between">
          <button
            onClick={() => setActiveTab(null)}
            className="text-base font-bold tracking-wide hover:text-slate-100 transition-colors"
          >
            EHR
          </button>
          {user && (
            <div className="flex items-center gap-2">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((current) => !current)}
                  className="flex items-center gap-2 rounded px-2 py-1 text-xs text-slate-100 transition-colors hover:bg-slate-700 hover:text-white"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <span>
                    {user.title
                      ? `${user.firstName} ${user.lastName}, ${user.title}`
                      : `${user.firstName} ${user.lastName}`}
                    <span className="ml-1.5 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                      {roleLabels[user.role] || user.role}
                    </span>
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 min-w-[16rem] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                    {otherUsers.length > 0 ? (
                      otherUsers.map((candidate) => (
                        <button
                          key={candidate.id}
                          onClick={() => {
                            setMenuOpen(false);
                            login(candidate);
                          }}
                          className="block w-full px-3 py-2 text-left transition-colors hover:bg-slate-100"
                          role="menuitem"
                        >
                          <div className="text-sm font-medium text-slate-800">
                            {candidate.title
                              ? `${candidate.firstName} ${candidate.lastName}, ${candidate.title}`
                              : `${candidate.firstName} ${candidate.lastName}`}
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {roleLabels[candidate.role] || candidate.role}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-slate-500">
                        No other demo users
                      </div>
                    )}

                    <div className="my-1 border-t border-slate-200" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/guide"
                aria-label="Open developer guide"
                title="Developer Guide"
                className="rounded p-1 text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 6.087c0-.63.224-1.24.63-1.72l1.33-1.57a1.5 1.5 0 012.122-.126l2.207 1.89a1.5 1.5 0 01.126 2.122l-1.33 1.57a2.25 2.25 0 01-1.72.797H14.25V6.087zM14.25 9.05L5.56 17.74a2.25 2.25 0 00-.57.986l-.69 2.413 2.412-.69a2.25 2.25 0 00.986-.57l8.69-8.69M12 4.5H5.25A2.25 2.25 0 003 6.75v12A2.25 2.25 0 005.25 21h12a2.25 2.25 0 002.25-2.25V12"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
