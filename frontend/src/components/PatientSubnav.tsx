"use client";

export type PatientSection = "overview" | "encounters" | "charts";

interface PatientSubnavProps {
  activeSection: PatientSection;
  onNavigate: (section: PatientSection) => void;
}

const navItems: { key: PatientSection; label: string }[] = [
  {
    key: "overview",
    label: "Overview",
  },
  {
    key: "encounters",
    label: "Encounters",
  },
  {
    key: "charts",
    label: "Charts",
  },
];

export default function PatientSubnav({
  activeSection,
  onNavigate,
}: PatientSubnavProps) {
  return (
    <div className="border-b border-slate-300 bg-slate-100 pr-4 shadow-sm sm:pr-6">
      <nav className="flex items-end overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            aria-current={activeSection === item.key ? "page" : undefined}
            className={`-mb-px shrink-0 cursor-pointer border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === item.key
                ? "border-slate-700 bg-white text-slate-800"
                : "border-transparent text-slate-600 hover:border-slate-400 hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
