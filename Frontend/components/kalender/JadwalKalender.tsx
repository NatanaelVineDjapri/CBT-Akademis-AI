"use client";

import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { JadwalEvent } from "@/types";

interface Props {
  events: JadwalEvent[];
  onEventClick: (event: JadwalEvent) => void;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function JadwalKalender({ events, onEventClick }: Props) {
  const calendarRef = useRef<InstanceType<typeof FullCalendar>>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [currentTitle, setCurrentTitle] = useState("");

  const getApi = () => calendarRef.current?.getApi();

  const updateTitle = () => {
    const title = getApi()?.view.title ?? "";
    setCurrentTitle(title);
  };

  const prev = () => { getApi()?.prev(); updateTitle(); };
  const next = () => { getApi()?.next(); updateTitle(); };

  const goToMonth = (month: number) => {
    getApi()?.gotoDate(new Date(pickerYear, month, 1));
    updateTitle();
    setShowPicker(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync title on mount
  useEffect(() => {
    setTimeout(updateTitle, 0);
  }, []);

  // Get current active month from calendar
  const getCurrentMonth = () => {
    const date = getApi()?.getDate();
    return date ? date.getMonth() : -1;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <style>{`
        .fc .fc-col-header-cell { background-color: var(--color-primary); color: white; font-size: 0.75rem; font-weight: 600; padding: 8px 0; }
        .fc .fc-daygrid-day-number { font-size: 0.8rem; color: var(--calendar-day-number-color); padding: 4px 6px; }
        .fc .fc-daygrid-day.fc-day-today { background-color: var(--calendar-today-bg) !important; }
        .fc .fc-event { border-radius: 6px; font-size: 0.75rem; padding: 3px 6px; border: none; cursor: pointer; }
        .fc .fc-daygrid-day-frame { min-height: unset; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: var(--calendar-border-color); }
        .fc .fc-toolbar { display: none; }
        .fc .fc-daygrid-day.fc-day-other .fc-daygrid-day-number { color: #d1d5db; }
        .fc .fc-daygrid-event { margin: 2px 6px; }
      `}</style>

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={next}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Custom Month Picker */}
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => {
                const d = getApi()?.getDate();
                if (d) setPickerYear(d.getFullYear());
                setShowPicker((v) => !v);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white cursor-pointer"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${showPicker ? "rotate-180" : ""}`} />
              <span>{currentTitle}</span>
            </div>

            {showPicker && (
              <div className="absolute right-0 top-10 z-50 bg-white rounded-xl shadow-xl border border-gray-100 w-64 p-3">
                {/* Year nav */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <button
                    onClick={() => setPickerYear((y) => y - 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700">{pickerYear}</span>
                  <button
                    onClick={() => setPickerYear((y) => y + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Month grid */}
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTHS.map((name, i) => {
                    const isActive =
                      pickerYear === (getApi()?.getDate().getFullYear() ?? -1) &&
                      i === getCurrentMonth();
                    return (
                      <button
                        key={i}
                        onClick={() => goToMonth(i)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        style={isActive ? { backgroundColor: "var(--color-primary)" } : {}}
                      >
                        {name.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="px-10 pb-10">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="id"
          headerToolbar={false}
          fixedWeekCount={false}
          events={events.map((e) => ({
            id: String(e.id),
            title: e.title,
            start: e.start,
            end: e.end,
            backgroundColor: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            extendedProps: { original: e },
          }))}
          eventClick={(info) => {
            const original = info.event.extendedProps.original as JadwalEvent;
            onEventClick(original);
          }}
          height="50vh"
          eventDisplay="block"
          displayEventTime={false}
        />
      </div>
    </div>
  );
}