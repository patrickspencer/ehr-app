"use client";

interface Code {
  id: number;
  code: string;
  description: string;
}

interface CodeListProps {
  codes: Code[];
  onRemove?: (codeId: number) => void;
  emptyMessage?: string;
}

export default function CodeList({ codes, onRemove, emptyMessage = "None assigned." }: CodeListProps) {
  if (codes.length === 0) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {codes.map((code) => (
        <span
          key={code.id}
          className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm"
        >
          <span className="font-mono font-medium text-teal-700">{code.code}</span>
          <span className="text-gray-600">{code.description}</span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(code.id)}
              className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              &times;
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
