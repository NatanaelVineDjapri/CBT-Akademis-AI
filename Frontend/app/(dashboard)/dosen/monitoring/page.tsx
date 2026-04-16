"use client";

import {useState, useEffect, use} from "react";
import useSWR from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import { useDebounce } from "@/hooks/useDebounce";
import MonitoringCard from "@/components/monitoring/MonitoringCard";

export default function DosenMonitoringPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    //   useEffect(() => { setPage(1); }, [debouncedSearch]);
    return (
    <div className="flex flex-col gap-4 pb-4">
          <div className="shrink-0">
            <Breadcrumb />
          </div>
    <div className="bg-gray-100 rounded-xl p-6 border border-blue-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-700">
          Monitoring
        </h2>

        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 rounded-full border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MonitoringCard
          title="Matematika A"
          subtitle="Ujian Perkuliahan"
          date="Sabtu, 21 Maret 2026"
          time="10.00 - 12.00"
        />

        <MonitoringCard
          title="Matematika B"
          subtitle="Ujian Perkuliahan"
          date="Sabtu, 21 Maret 2026"
          time="10.00 - 12.00"
        />

        <MonitoringCard
          title="Matematika C"
          subtitle="Ujian Perkuliahan"
          date="Sabtu, 21 Maret 2026"
          time="10.00 - 12.00"
        />
      </div>
    </div>
    /</div>
  );

}