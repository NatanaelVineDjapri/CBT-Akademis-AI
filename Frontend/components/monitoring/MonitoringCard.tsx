"use client";

import { Bookmark } from "lucide-react";

type CardProps = {
  title: string;
  subtitle: string;
  date: string;
  time: string;
};

function MonitoringCard({ title, subtitle, date, time }: CardProps) {
  return (
    <div className="text-white rounded-2xl p-5 shadow-md flex flex-col justify-between min-h-[140px]" style={{backgroundColor: "var(--color-primary)"}}>
      <div className="flex items-center gap-2 text-sm font-medium opacity-90">
        <Bookmark size={16} />
        {title}
      </div>

      <div className="mt-2">
        <p className="font-semibold">{subtitle}</p>
        <p className="text-sm opacity-90">{date}</p>
        <p className="text-sm opacity-90">{time}</p>
      </div>

      <div className="flex justify-end mt-3">
        <button className="bg-white text-teal-700 text-sm px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition">
          Pantau
        </button>
      </div>
    </div>
  );
}

export default MonitoringCard;