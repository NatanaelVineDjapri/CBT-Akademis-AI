export default function MonitoringPesertaSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-6">

      {/* Card 1: Riwayat Attempt */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-200 rounded-lg shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Section title */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>

        {/* Table rows */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {[6, 10, 16, 10, 10, 10, 10, 12].map((w, i) => (
                <th key={i} className="px-4 py-3">
                  <div className={`h-3 bg-gray-100 rounded w-${w}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-6" /></td>
                <td className="px-4 py-4"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
                <td className="px-4 py-4">
                  <div className="h-3 bg-gray-100 rounded w-20 mb-1.5" />
                  <div className="h-3 bg-gray-100 rounded w-16" />
                </td>
                <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-10" /></td>
                {[1, 2, 3].map(j => (
                  <td key={j} className="px-3 py-4"><div className="h-5 bg-gray-100 rounded-full w-10 mx-auto" /></td>
                ))}
                <td className="px-4 py-4"><div className="h-5 bg-gray-100 rounded-full w-12 mx-auto" /></td>
                <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-8 mx-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card 2: Total Pelanggaran per Jenis */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3"><div className="h-3 bg-gray-100 rounded w-32" /></th>
              <th className="px-5 py-3 w-32"><div className="h-3 bg-gray-100 rounded w-16 mx-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-40" /></td>
                <td className="px-5 py-4"><div className="h-5 bg-gray-100 rounded-full w-10 mx-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
