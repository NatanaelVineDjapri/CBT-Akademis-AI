import { TriangleAlert } from "lucide-react";

export default function PengumumanCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 items-start">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <TriangleAlert size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Pengumuman</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Ujian Tengah Semester akan dimulai minggu depan. Pastikan Anda sudah
          mempersiapkan diri dengan baik. Jangan lupa untuk mengecek jadwal
          ujian dan materi yang akan diujikan.
        </p>
      </div>
    </div>
  );
}
