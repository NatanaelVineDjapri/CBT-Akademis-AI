"use client";
import { useState, useMemo } from "react";

const logs = [
  {
    id: 1,
    raw: '[2026-03-26 07:15:22] [USER] [UPDATE_ROLE] - User "budi.santoso" role changed from "Student" to "Admin" by "superadmin"',
  },
  {
    id: 2,
    raw: '[2026-03-26 07:14:45] [USER] [KICK] - User "andi.pratama" removed from system by "admin01"',
  },
  {
    id: 3,
    raw: '[2026-03-26 07:13:10] [USER] [UPDATE_PROFILE] - User "siti.rahma" updated account information',
  },
  {
    id: 4,
    raw: '[2026-03-26 07:12:10] [EXAM] [SCHEDULED] - UAS "Algoritma dan Struktur Data" scheduled for 2026-04-10 09:00:00 (Class: IF-2023)',
  },
  {
    id: 5,
    raw: '[2026-03-26 07:11:34] [EXAM] [STARTED] - UAS "Algoritma dan Struktur Data" started (Class: IF-2023, Participants: 120)',
  },
  {
    id: 6,
    raw: '[2026-03-26 07:09:54] [EXAM] [ENDED] - UAS "Algoritma dan Struktur Data" ended (Class: IF-2023, Submitted: 115, Absent: 5)',
  },
  {
    id: 7,
    raw: "[2026-03-26 07:09:22] [SYSTEM] [MAINTENANCE_START] - Scheduled system maintenance started",
  },
  {
    id: 8,
    raw: "[2026-03-26 07:04:04] [SYSTEM] [MAINTENANCE_END] - System maintenance completed successfully",
  },
  {
    id: 9,
    raw: '[2026-03-26 07:01:20] [ANNOUNCEMENT] [CREATED] - Announcement "Jadwal UAS Telah Dirilis" published for Students and Lecturers',
  },
  {
    id: 10,
    raw: '[2026-03-26 07:01:14] [ANNOUNCEMENT] [UPDATED] - Announcement "Jadwal UAS Telah Dirilis" updated by "admin01"',
  },
];

export default function SystemLog() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter((l) => l.raw.toLowerCase().includes(q));
  }, [search]);

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 22,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--color-primary)",
            opacity: 0.6,
            cursor: "pointer",
          }}
        >
          Home
        </span>
        <span style={{ fontSize: 16, color: "var(--color-primary)", opacity: 0.5 }}>›</span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-primary)",
          }}
        >
          Log
        </span>
      </div>
      <div
        style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: "24px 28px 8px 28px",    
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            System Log
          </h2>

          <div style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="6" cy="6" r="4.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" />
              <line
                x1="9.5"
                y1="9.5"
                x2="12.5"
                y2="12.5"
                stroke="var(--color-primary)"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: 34,
                paddingRight: 14,
                paddingTop: 8,
                paddingBottom: 8,
                border: "1px solid var(--calendar-border-color)",
                borderRadius: 20,
                fontSize: 13,
                color: "black",
                outline: "none",
                background: "#ffffff",
                width: 210,
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--calendar-border-color)")}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "black",
                  paddingBottom: 10,
                  paddingLeft: 2,
                  borderBottom: "1px solid var(--calendar-border-color)",
                }}
              >
                #
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <tr
                key={log.id}
                style={{ transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td
                  style={{
                    fontSize: 13.5,
                    color: "black",
                    padding: "14px 6px",
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid var(--calendar-border-color)"
                        : "none",
                    lineHeight: 1.6,
                  }}
                >
                  {log.raw}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  style={{
                    padding: "32px 2px",
                    textAlign: "center",
                    color: "var(--color-primary)",
                    opacity: 0.4,
                    fontSize: 13,
                  }}
                >
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}