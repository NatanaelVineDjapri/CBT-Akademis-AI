interface Props {
  count?: number;
}

export default function BankSoalGlobalSkeleton({ count = 8 }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-4 flex flex-col gap-3 animate-pulse"
          style={{ backgroundColor: "var(--color-primary)", opacity: 0.5 }}
        >
          {/* Header: icon + pill */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/30 shrink-0" />
            <div className="h-6 rounded-full bg-white/30 flex-1" />
          </div>

          {/* Universitas + Created by */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-white/30 shrink-0" />
              <div className="h-3 rounded bg-white/30 w-3/4" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-white/30 shrink-0" />
              <div className="h-3 rounded bg-white/30 w-1/2" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20" />

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <div className="h-3 rounded bg-white/30 w-full" />
            <div className="h-3 rounded bg-white/30 w-4/5" />
          </div>

          {/* Daftar Bab + Jumlah Soal */}
          <div className="bg-white/90 rounded-xl px-3 py-2 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="h-2 rounded bg-gray-200 w-16" />
              <div className="h-3 rounded bg-gray-200 w-full" />
            </div>
            <div className="flex flex-col gap-1 items-end shrink-0">
              <div className="h-2 rounded bg-gray-200 w-16" />
              <div className="h-3 rounded bg-gray-200 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
