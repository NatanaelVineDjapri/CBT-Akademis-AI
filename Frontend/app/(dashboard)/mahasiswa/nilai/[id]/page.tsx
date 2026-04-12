import BadgeNilai from "@/components/dashboard/mahasiswa/BadgeNilai";
import JawabanPilihanGanda from "@/components/dashboard/mahasiswa/JawabanPilihanGanda";
import JawabanCheckbox from "@/components/dashboard/mahasiswa/JawabanCheckbox";

export default function NilaiDetailPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[var(--color-primary)]">
          Nilai
        </h1>
        <p className="text-[var(--color-primary)]">
          Lihat hasil ujian dan perkembangan belajar Anda
        </p>
      </div>

      {/* 🔥 INI YANG NGATUR JARAK */}
      <div className="space-y-4">
        <BadgeNilai/>
        <JawabanPilihanGanda />
        <JawabanCheckbox />
      </div>

    </div>
  );
}