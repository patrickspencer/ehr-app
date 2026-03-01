"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Code {
  id: number;
  code: string;
  description: string;
}

interface CodeSearchProps {
  label: string;
  placeholder?: string;
  searchFn: (query: string) => Promise<Code[]>;
  onSelect: (code: Code) => void;
  excludeIds?: number[];
}

export default function CodeSearch({ label, placeholder, searchFn, onSelect, excludeIds = [] }: CodeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Code[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const excludeIdsRef = useRef(excludeIds);
  excludeIdsRef.current = excludeIds;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchFn(query);
        setResults(data.filter((c) => !excludeIdsRef.current.includes(c.id)));
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, searchFn]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(code: Code) {
    onSelect(code);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder || `Search ${label.toLowerCase()}...`}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
      />
      {loading && (
        <div className="absolute right-3 top-[2.1rem] text-xs text-gray-400">Searching...</div>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((code) => (
            <li key={code.id}>
              <button
                type="button"
                onClick={() => handleSelect(code)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
              >
                <span className="font-mono font-medium text-slate-700">{code.code}</span>
                <span className="text-gray-600 truncate">{code.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && !loading && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
          No results found.
        </div>
      )}
    </div>
  );
}
