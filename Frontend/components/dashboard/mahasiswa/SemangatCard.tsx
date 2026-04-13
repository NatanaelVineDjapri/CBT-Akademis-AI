"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { quotes } from "@/types";

export default function SemangatCard() {
  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  return (
    <div
      className="w-full rounded-2xl px-5 py-4 flex items-start gap-2"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <Sparkles size={18} className="text-white shrink-0 mt-0.5" />
      <p className="text-sm text-white leading-relaxed">{quote}</p>
    </div>
  );
}
