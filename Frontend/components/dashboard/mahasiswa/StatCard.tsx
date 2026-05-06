"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { CheckSquare, Clock, TrendingUp, Award } from "lucide-react";

const iconMap = {
  check: { icon: CheckSquare, bg: "bg-green-100", color: "text-green-600" },
  clock: { icon: Clock, bg: "bg-blue-100", color: "text-blue-600" },
  chart: { icon: TrendingUp, bg: "bg-pink-100", color: "text-pink-600" },
  trophy: { icon: Award, bg: "bg-amber-100", color: "text-amber-600" },
};

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const num = parseFloat(value);
  const isFloat = value.includes(".");

  useEffect(() => {
    const el = ref.current;
    if (!el || isNaN(num)) {
      if (el) el.textContent = value;
      return;
    }

    if (sessionStorage.getItem("stat-animated")) {
      el.textContent = value;
      return;
    }

    const controls = animate(0, num, {
      duration: 3.2,
      ease: "easeOut",
      onUpdate(v) {
        el.textContent = isFloat ? v.toFixed(1) : String(Math.round(v));
      },
      onComplete() {
        sessionStorage.setItem("stat-animated", "1");
      },
    });
    return () => controls.stop();
  }, [num, value, isFloat]);

  return <span ref={ref}>0</span>;
}

export default function StatCard({ label, value, icon }: {
  label: string; value: string; color: string; icon: keyof typeof iconMap;
}) {
  const { icon: Icon, bg, color } = iconMap[icon];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">
          <AnimatedNumber value={value} />
        </p>
      </div>
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  );
}
