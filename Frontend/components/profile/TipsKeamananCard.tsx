"use client";

import { ShieldCheck } from "lucide-react";
import { tips } from "@/types";

export default function TipsKeamananCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-[305px]">
      <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
        Tips Keamanan
      </h2>
      <div className="flex flex-col gap-3">
        {tips.map((tip) => (
          <div key={tip} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
            <div className="p-2 rounded-lg bg-gray-50 shrink-0">
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
            </div>
            <p className="text-sm text-gray-700 leading-snug">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
