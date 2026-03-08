"use client";

import { useState } from "react";

export function CodeBlock({
  children,
  lang,
}: {
  children: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative my-4 rounded-lg bg-gray-900 text-sm">
      {lang && (
        <div className="px-4 pt-2 text-xs text-gray-500">{lang}</div>
      )}
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 opacity-0 transition hover:bg-gray-600 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-4 text-gray-100">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-800">
      {children}
    </code>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 font-semibold text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-200">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-gray-600">
                  <InlineCode>{cell}</InlineCode>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GuideNav({ active }: { active: "setup" | "overview" }) {
  return (
    <nav className="mx-auto flex max-w-6xl gap-4 px-6 py-2 border-b border-gray-100">
      <a
        href="/guide"
        className={`text-sm font-medium px-3 py-1.5 rounded-md transition ${
          active === "setup"
            ? "bg-slate-100 text-slate-800"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        }`}
      >
        Setup
      </a>
      <a
        href="/guide/overview"
        className={`text-sm font-medium px-3 py-1.5 rounded-md transition ${
          active === "overview"
            ? "bg-slate-100 text-slate-800"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        }`}
      >
        Tech Overview
      </a>
    </nav>
  );
}
