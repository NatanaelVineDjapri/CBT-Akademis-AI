"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortOrder = "asc" | "desc" | null;

interface Props {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

export default function SortButton({ value, onChange }: Props) {
  const handleClick = () => {
    if (value === null) onChange("asc");
    else if (value === "asc") onChange("desc");
    else onChange(null);
  };

  const Icon = value === "asc" ? ArrowUp : value === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
      style={value ? { color: "var(--color-primary)", borderColor: "var(--color-primary)" } : { color: "#9ca3af" }}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
