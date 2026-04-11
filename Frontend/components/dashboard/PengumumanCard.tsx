export default function PengumumanCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 items-start">
      <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <circle cx="12" cy="16" r="0.5" fill="white"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Pengumuman</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Ujian Tengah Semester akan dimulai minggu depan. Pastikan Anda sudah
          mempersiapkan diri dengan baik. Jangan lupa untuk mengecek jadwal ujian
          dan materi yang akan diujikan.
        </p>
      </div>
    </div>
  );
}