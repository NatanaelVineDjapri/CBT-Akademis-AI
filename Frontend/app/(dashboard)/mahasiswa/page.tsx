import StatCard from "@/components/dashboard/mahasiswa/StatCard";
import UjianSegeraCard from "@/components/dashboard/mahasiswa/UjianSegeraCard";
import UjianAkanDatangCard from "@/components/dashboard/mahasiswa/UjianAkanDatang";
import NilaiTerbaruCard from "@/components/dashboard/mahasiswa/NilaiTerbaruCard";
import PengumumanCard from "@/components/dashboard/PengumumanCard";

export default function BerandaMahasiswaPage() {
  return (
    <div className="min-h-screen bg-teal-50 p-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-teal-600">Beranda</h1>
        <p className="text-xs text-gray-500 mt-1">
          Selamat datang kembali, Nama! Lihat ringkasan aktivitas Anda.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Ujian Selesai" value="13" color="green" icon="check" />
        <StatCard label="Ujian Akan Datang" value="3" color="blue" icon="clock" />
        <StatCard label="Rata-rata Nilai" value="87.5" color="pink" icon="chart" />
        <StatCard label="Nilai Tertinggi" value="100" color="amber" icon="trophy" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-4">
          <UjianSegeraCard />
          <UjianAkanDatangCard />
        </div>
        <NilaiTerbaruCard />
      </div>
      <PengumumanCard />
    </div>
  );
}