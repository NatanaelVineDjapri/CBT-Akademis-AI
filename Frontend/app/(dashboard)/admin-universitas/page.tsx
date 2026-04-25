'use client'

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Icons = {
  chart: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  users: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  clipboard: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 2v4h6V2"/><path d="M9 12h6M9 16h4"/></svg>,
  check: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  doc: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  cal: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  person: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  pencil: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  bell: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  chevL: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  statBar: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  percent: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  info: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  wrench: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  shield: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  lock: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

const C = {
  primary:      "#097797",
  primaryLight: "#E1F5EE",
  warning:      "#f59e0b",
  warningLight: "#fef3c7",
  danger:       "#ef4444",
  dangerLight:  "#fef2f2",
  univBg:       "#eff6ff",
  univIcon:     "#3b82f6",
  prodiBg:      "#f0fdf4",
  prodiIcon:    "#22c55e",
  tahunBg:      "#faf5ff",
  tahunIcon:    "#a855f7",
  calToday:     "#eff9fb",
  calBorder:    "#e5e7eb",
  ink:          "#0c2340",
  surface:      "#eaf7f7",
  bg:           "#fafafa",
};

const statData = [
  { label: "Total Pendaftar",     value: "517 pendaftar", icon: Icons.chart,     bg: C.univBg,       iconBg: C.univIcon  },
  { label: "Total Peserta Ujian", value: "489 peserta",   icon: Icons.users,     bg: C.prodiBg,      iconBg: C.prodiIcon },
  { label: "Jumlah Ujian Aktif",  value: "7",             icon: Icons.clipboard, bg: C.tahunBg,      iconBg: C.tahunIcon },
  { label: "Selesai Ujian",       value: "190 peserta",   icon: Icons.check,     bg: C.warningLight, iconBg: C.warning   },
];

const monitoringData = [
  { name: "PMB Gel C 2025/2026", date: "21 Maret 2026", time: "10:00 – 12:00", peserta: "100 peserta" },
  { name: "PMB Gel D 2025/2026", date: "22 Maret 2026", time: "10:00 – 12:00", peserta: "100 peserta" },
];

const bankSoal = [
  { name: "PMB versi A", soal: "50 soal" },
  { name: "PMB versi B", soal: "50 soal" },
];

const ujianPMB = [
  { name: "PMB Gel A 2025/2026", date: "21 Maret 2026", time: "10:00 – 12:00" },
  { name: "PMB Gel B 2025/2026", date: "22 Maret 2026", time: "10:00 – 12:00" },
];

const chartData = [
  { name: "Ujian PMB F.", nilai: 68 },
  { name: "Ujian PMB G.", nilai: 52 },
  { name: "Ujian PMB H.", nilai: 55 },
  { name: "Ujian PMB I.", nilai: 74 },
  { name: "Ujian PMB J.", nilai: 65 },
];

const calDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const calWeeks = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
];

const pieData = [
  { name: "Ujian PMB F..", value: 30, color: "#4A90D9" },
  { name: "Ujian PMB G..", value: 24, color: "#7EC8E3" },
  { name: "Ujian PMB H..", value: 18, color: "#C8D6DF" },
  { name: "Ujian PMB I..", value: 42, color: "#F4A460" },
  { name: "Ujian PMB J..", value: 20, color: "#F0C080" },
];

const pelanggaranList = [
  { name: "PMB Gel F..", date: "17 Maret 2026", count: 30 },
  { name: "PMB Gel G..", date: "14 Maret 2026", count: 24 },
  { name: "PMB Gel H..", date: "11 Maret 2026", count: 18 },
  { name: "PMB Gel I..", date: "10 Maret 2026", count: 42 },
];

const pengumumanInitial = [
  {
    status: "Aktif",
    text: `Ujian Tengah Semester akan dimulai minggu depan. Pastikan Anda sudah mempersiapkan diri dengan baik. Jangan lupa untuk mengecek jadwal ujian dan materi yang akan diujikan.`,
    active: true,
  },
  {
    status: "Nonaktif",
    text: `Sistem akan mengalami maintenance pada pukul 22.00–00.00, mohon untuk sementara tidak melakukan penginputan nilai.`,
    active: false,
  },
];

export default function Dashboard() {
  const [maintenance, setMaintenance] = useState(false);
  const [pengumumanText, setPengumumanText] = useState("");
  const [announcements, setAnnouncements] = useState(pengumumanInitial);

  const toggleAnnouncement = (i) => {
    setAnnouncements((prev) =>
      prev.map((p, idx) =>
        idx === i
          ? { ...p, active: !p.active, status: !p.active ? "Aktif" : "Nonaktif" }
          : p
      )
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito', sans-serif", fontSize: 13, padding: "20px 22px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Hello</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.primary, lineHeight: 1.2 }}>Welcome back Claudio!</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fff", border: `1px solid ${C.calBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, cursor: "pointer" }}>
            {Icons.bell}
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, #0c2340)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>
            C
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", marginBottom: 16, border: `1px solid ${C.calBorder}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 12 }}>Statistika PMB Tahun ajaran 2025/2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {statData.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: s.bg, borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#6b7280", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Monitoring + Kalender */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Monitoring */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink }}>
              <span style={{ color: C.primary }}>{Icons.doc}</span>
              Monitoring Ujian Berlangsung
            </div>
            <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Lihat Semua</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {monitoringData.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, border: `1px solid ${C.calBorder}`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary, flexShrink: 0 }}>
                    {Icons.doc}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.ink, marginBottom: 3 }}>{m.name}</div>
                    <div style={{ display: "flex", gap: 10, color: "#9ca3af", fontSize: 10, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.cal} {m.date}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.clock} {m.time}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.person} {m.peserta}</span>
                    </div>
                  </div>
                </div>
                <button style={{ background: C.ink, color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Pantau</button>
              </div>
            ))}
          </div>
        </div>

        {/* Kalender */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.calBorder}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>{Icons.chevL}</button>
              <button style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.calBorder}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>{Icons.chevR}</button>
            </div>
            <div style={{ background: C.calToday, color: C.primary, fontWeight: 700, fontSize: 12, borderRadius: 8, padding: "4px 12px" }}>~ Maret 2026</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {calDays.map((d) => (
                  <th key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, padding: "4px 0", background: C.primary, color: "#fff" }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calWeeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((day, di) => (
                    <td key={di} style={{ textAlign: "center", padding: "4px 0", fontSize: 11, color: day === 21 || day === 22 ? C.primary : day ? C.ink : "transparent", fontWeight: day === 21 || day === 22 ? "800" : "500" }}>
                      {day || ""}
                      {(day === 21 || day === 22) && (
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary, margin: "1px auto 0" }} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Bank Soal + Ujian PMB */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Bank Soal */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink }}>
              <span style={{ color: C.primary }}>{Icons.doc}</span>
              Bank Soal Terbaru
            </div>
            <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Lihat Semua</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bankSoal.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, border: `1px solid ${C.calBorder}`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary, flexShrink: 0 }}>
                    {Icons.doc}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.ink, marginBottom: 3 }}>{b.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", fontSize: 10 }}>
                      <span>{Icons.pencil}</span>{b.soal}
                    </div>
                  </div>
                </div>
                <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Lihat Detail</button>
              </div>
            ))}
          </div>
        </div>

        {/* Ujian PMB */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink }}>
              <span style={{ color: C.primary }}>{Icons.doc}</span>
              Ujian PMB
            </div>
            <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Lihat Semua</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ujianPMB.map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, border: `1px solid ${C.calBorder}`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary, flexShrink: 0 }}>
                    {Icons.doc}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.ink, marginBottom: 3 }}>{u.name}</div>
                    <div style={{ display: "flex", gap: 10, color: "#9ca3af", fontSize: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.cal} {u.date}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.clock} {u.time}</span>
                    </div>
                  </div>
                </div>
                <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Lihat Detail</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistik Bawah */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", border: `1px solid ${C.calBorder}`, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 14 }}>
          <span style={{ color: C.primary }}>{Icons.statBar}</span>
          Statistika Ujian PMB Tahun Ajaran 2025/2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: C.calToday, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>{Icons.statBar}</div>
              <div>
                <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>Rata – rata Nilai</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.ink }}>78.69</div>
              </div>
            </div>
            <div style={{ background: C.prodiBg, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: C.prodiIcon, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>{Icons.percent}</div>
              <div>
                <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>Persentase Kelulusan</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.ink }}>74%</div>
              </div>
            </div>
            <div style={{ background: C.dangerLight, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: C.danger, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>{Icons.users}</div>
              <div>
                <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>Jumlah Tidak Lulus</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.ink }}>102 peserta</div>
              </div>
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.calBorder} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.calBorder}`, fontSize: 11 }} />
                <Line type="monotone" dataKey="nilai" stroke={C.primary} strokeWidth={2.5} dot={{ fill: C.primary, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 6, paddingLeft: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6b7280" }}>
                <div style={{ width: 20, height: 2, background: C.primary, borderRadius: 2 }} />
                Performa Peserta meningkat sejak menurun
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.warning }}>
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: `8px solid ${C.warning}` }} />
                Ujian F memiliki tingkat kelulusan rendah
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Grafik Pelanggaran + Total Pelanggaran */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Grafik Pelanggaran Ujian */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 14 }}>
            <span style={{ color: C.primary }}>{Icons.statBar}</span>Grafik Pelanggaran Ujian
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <PieChart width={180} height={180}>
              <Pie data={pieData} cx={85} cy={85} innerRadius={0} outerRadius={80} dataKey="value" strokeWidth={2} stroke="#fff">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 8 }}>
              {pieData.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.ink }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  {p.name}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.warning, marginTop: 8 }}>
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: `8px solid ${C.warning}` }} />
            Ujian PMB G memiliki total pelanggaran tinggi
          </div>
        </div>

        {/* Total Pelanggaran Ujian */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 14 }}>
            <span style={{ color: C.primary }}>{Icons.shield}</span>Total Pelanggaran Ujian
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {pelanggaranList.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < pelanggaranList.length - 1 ? `1px solid ${C.calBorder}` : "none" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: C.ink }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.date}</div>
                </div>
                <div style={{ background: C.primary, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {p.count} Pelanggaran
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.warning, marginBottom: 10 }}>
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: `8px solid ${C.warning}` }} />
            Ujian PPKn B memiliki total pelanggaran tinggi
          </div>
          <button style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Lihat Semua
          </button>
        </div>
      </div>

      {/* Row: Pengumuman + Maintenance Break */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Pengumuman */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 14 }}>
            <span style={{ color: C.primary }}>{Icons.info}</span>Pengumuman
          </div>
          <textarea
            value={pengumumanText}
            onChange={(e) => setPengumumanText(e.target.value)}
            placeholder="Tulis pengumuman..."
            style={{ width: "100%", height: 80, border: `1px solid ${C.calBorder}`, borderRadius: 10, padding: "8px 10px", fontSize: 12, color: C.ink, resize: "none", outline: "none", fontFamily: "inherit", marginBottom: 12, boxSizing: "border-box" }}
          />
          <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "7px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Unggah
          </button>
        </div>

        {/* Maintenance Break */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${C.calBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 12 }}>
            <span style={{ color: C.primary }}>{Icons.wrench}</span>Maintenance Break
          </div>
          <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>
            Mengaktifkan mode Maintenance Break akan menonaktifkan sementara seluruh akses dan fitur sistem bagi pengguna.
          </p>
          <button
            onClick={() => setMaintenance(!maintenance)}
            style={{ background: maintenance ? C.danger : C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
          >
            Maintenance: {maintenance ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Daftar Pengumuman */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", border: `1px solid ${C.calBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 14 }}>
          <span style={{ color: C.primary }}>{Icons.info}</span>Daftar Pengumuman
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {announcements.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: C.surface, border: `1px solid ${C.calBorder}`, borderRadius: 12, padding: "12px 14px", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary, flexShrink: 0 }}>
                  {Icons.lock}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 12, color: C.ink, marginBottom: 4 }}>
                    Status: {p.status}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{p.text}</div>
                </div>
              </div>
              <button
                onClick={() => toggleAnnouncement(i)}
                style={{ background: p.active ? C.danger : C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
              >
                {p.active ? "Arsipkan" : "Aktifkan"}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
