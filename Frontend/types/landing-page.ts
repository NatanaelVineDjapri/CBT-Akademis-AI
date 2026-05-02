import { LayoutGrid, ShieldCheck, Sparkles } from "lucide-react";

export const challenges = [
  {
    tag: "KOREKSI",
    t: "Koreksi Manual Memakan Waktu Berhari-hari",
    bullets: [
      "Dosen mengoreksi ratusan berkas ujian satu persatu",
      "Rekap nilai rawan salah ketik dan hilang",
      "Hasil baru keluar setelah minggu-minggu menunggu",
    ],
  },
  {
    tag: "KEAMANAN",
    t: "Kecurangan Sulit Dipantau saat Ujian Online",
    bullets: [
      "Mahasiswa bisa pindah tab tanpa terdeteksi",
      "Sulit memastikan identitas pesertat",
      "Bukti pelanggaran sulit dikumpulkan",
    ],
  },
  {
    tag: "BANK SOAL",
    t: "Soal Tersebar di Berbagai File dan Folder",
    bullets: [
      "Setiap dosen menyimpan soal sendiri-sendiri",
      "Sulit menyusun ujian lintas kelas",
      "Soal lama sulit digunakan ulang",
    ],
  },
];

export const features = [
  {
    icon: LayoutGrid,
    t: "Bank Soal Terpusat",
    d: "Ribuan soal terorganisir per mata kuliah, level kesulitan, dan kompetensi",
  },
  {
    icon: ShieldCheck,
    t: "Consectetur Adipiscing",
    d: "Deteksi pindah tab, kamera, dan kecurangan tanpa aplikasi tambahan.",
  },
  {
    icon: Sparkles,
    t: "Sed Do Eiusmod",
    d: "Bantu menyusun soal, mengoreksi esai, dan menarik insight hasil ujian.",
  },
];

export const links = [
  { heading: "Produk", items: ["CBT", "SIAKAD", "PMB", "SPMI"] },
  { heading: "Perusahaan", items: ["Tentang", "Karier", "Blog"] },
  { heading: "Dukungan", items: ["Bantuan", "Status", "API"] },
];

export const options = [
  { l: "A", t: "Linear search", sel: false },
  { l: "B", t: "Binary search", sel: true },
  { l: "C", t: "Bubble sort", sel: false },
  { l: "D", t: "Hashing", sel: false },
];

export const steps = [
  {
    n: "01",
    t: "Susun Soal",
    d: "Tarik soal dari bank atau minta asisten AI menyusunkan berdasarkan silabus.",
  },
  {
    n: "02",
    t: "Jadwalkan Ujian",
    d: "Tentukan durasi, mahasiswa peserta, dan mode pengawasan.",
  },
  {
    n: "03",
    t: "Nilai Otomatis",
    d: "Pilihan ganda dinilai otomatis; esai dibantu AI dengan rubrik dosen.",
  },
];

export const tabs = ["Semua", "Basis Data", "Algoritma", "Jaringan"];
export const items = [
  {
    t: "Normalisasi 3NF pada tabel transaksi",
    type: "Pilihan Ganda",
    diff: "Sedang",
    count: "128×",
  },
  {
    t: "Perbedaan B-Tree dan B+Tree",
    type: "Esai Singkat",
    diff: "Sulit",
    count: "47×",
  },
  {
    t: "Indeks komposit pada query WHERE",
    type: "Pilihan Ganda",
    diff: "Mudah",
    count: "302×",
  },
];
export const students = [
  { name: "Ayu S.", badge: "LIVE", color: "bg-green-500" },
  { name: "Budi R.", badge: "TAB", color: "bg-orange-500" },
  { name: "Citra L.", badge: "LIVE", color: "bg-green-500" },
  { name: "Dewi P.", badge: "LIVE", color: "bg-green-500" },
];

export const bars = [
  { label: "W1", h: 35 },
  { label: "W2", h: 55 },
  { label: "W3", h: 40 },
  { label: "W4", h: 50 },
  { label: "W5", h: 60 },
  { label: "UTS", h: 85, active: true },
  { label: "W7", h: 48 },
];

export const quotes = [
  {
    q: "Waktu koreksi UTS turun dari 2 minggu ke 2 hari. Dosen bisa fokus ke pembelajaran, bukan ke kertas.",
    n: "Dr. Rina Kusuma",
    r: "Kaprodi Informatika, Universitas Dipo Nusantara",
    initials: "RK",
  },
  {
    q: "Bank soal yang terpusat bikin kami konsisten lintas kelas paralel. Mahasiswa dapat kualitas ujian yang setara.",
    n: "Prof. Hendra Sukmawan",
    r: "Dekan FEB, Institut Teknologi Merdeka",
    initials: "HS",
  },
  {
    q: "Asisten AI-nya bantu susun soal dari silabus — saya tinggal review. Hemat 3–4 jam tiap minggu.",
    n: "Ibu Siti Nuraini",
    r: "Ibu Siti Nuraini",
    initials: "SN",
  },
];