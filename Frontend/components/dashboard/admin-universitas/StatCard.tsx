"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (sessionStorage.getItem("stat-animated")) {
      el.textContent = Math.round(value).toLocaleString("id-ID");
      return;
    }

    const controls = animate(0, value, {
      duration: 3.2,
      ease: "easeOut",
      onUpdate(v) {
        el.textContent = Math.round(v).toLocaleString("id-ID");
      },
      onComplete() {
        sessionStorage.setItem("stat-animated", "1");
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>0</span>;
}

export default function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, white)` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800 leading-tight">
          {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
        </p>
      </div>
    </div>
  );
}
