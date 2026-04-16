export default function BankSoalSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse min-h-screen">
      {/* Card */}
      <div
        className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1"
        style={{ border: "2px solid var(--color-primary)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="h-5 w-24 rounded bg-gray-200" />

          <div className="flex items-center gap-2">
            <div className="h-9 w-56 rounded-xl bg-gray-100" />
            <div className="h-9 w-32 rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "w-12",
                  "w-52",
                  "w-28",
                  "w-28",
                  "w-24",
                  "w-24",
                  "w-20",
                ].map((w, i) => (
                  <th key={i} className={`px-4 py-3 ${w}`}>
                    <div className="h-3 rounded bg-gray-100" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 12 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-5 py-3.5">
                    <div className="h-3.5 w-6 rounded bg-gray-100" />
                  </td>

                  <td className="px-4 py-3.5">
                    <div
                      className="h-3.5 rounded bg-gray-200"
                      style={{
                        width: `${60 + (i % 3) * 10}%`,
                      }}
                    />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="h-3.5 w-14 rounded bg-gray-100" />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="h-3.5 w-20 rounded bg-gray-100" />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="h-3.5 w-6 rounded bg-gray-100" />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="h-3.5 w-12 rounded bg-gray-100" />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <div className="h-4 w-4 rounded bg-gray-100" />
                      <div className="h-4 w-4 rounded bg-gray-100" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}