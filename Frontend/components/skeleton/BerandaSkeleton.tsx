export default function BerandaSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="h-7 w-12 rounded bg-gray-200" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Pengumuman */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="h-4 w-32 rounded bg-gray-200 mb-3" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-3/4 rounded bg-gray-100" />
        </div>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Kiri */}
        <div className="flex flex-col gap-4">
          {/* Ujian Segera */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-40 rounded bg-gray-200 mb-3" />
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
              <div className="h-8 w-16 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* Ujian Akan Datang */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-36 rounded bg-gray-200 mb-3" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ujian Per Bulan Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-36 rounded bg-gray-200 mb-4" />
            <div className="h-[200px] rounded-xl bg-gray-100" />
          </div>
        </div>

        {/* Kanan */}
        <div className="flex flex-col gap-4">
          {/* Nilai Terbaru */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-28 rounded bg-gray-200 mb-3" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="py-2">
                  <div className="flex justify-between mb-1">
                    <div className="h-3.5 w-2/3 rounded bg-gray-200" />
                    <div className="h-3.5 w-8 rounded bg-gray-200" />
                  </div>
                  <div className="h-2.5 w-24 rounded bg-gray-100 mb-2" />
                  <div className="h-1.5 w-full rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
            <div className="h-9 w-full rounded-xl bg-gray-200 mt-2" />
          </div>

          {/* Perkembangan Nilai Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-36 rounded bg-gray-200 mb-1" />
            <div className="h-3 w-48 rounded bg-gray-100 mb-4" />
            <div className="h-[200px] rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
