interface Props {
  canEdit?: boolean;
  count?: number;
}

export default function SoalTableSkeleton({ canEdit = false, count = 10 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50 animate-pulse">
          {/* # */}
          <td className="px-5 py-4">
            <div className="h-3 w-6 rounded bg-gray-100" />
          </td>

          {/* Soal + tingkat kesulitan */}
          <td className="px-4 py-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-3 rounded bg-gray-200" style={{ width: `${55 + (i % 4) * 10}%` }} />
              <div className="h-3 rounded bg-gray-200" style={{ width: `${30 + (i % 3) * 8}%` }} />
              <div className="h-2.5 w-12 rounded bg-gray-100 mt-0.5" />
            </div>
          </td>

          {/* Jenis Soal */}
          <td className="px-4 py-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-gray-100 shrink-0" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
          </td>

          {/* Jawaban — opsi list */}
          <td className="px-4 py-4">
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-100 shrink-0" />
                  <div
                    className={`h-3 rounded ${j === (i % 4) ? "bg-gray-200" : "bg-gray-100"}`}
                    style={{ width: `${40 + (j % 3) * 15}%` }}
                  />
                </div>
              ))}
            </div>
          </td>

          {/* Media Soal */}
          <td className="px-4 py-4">
            <div className="h-3 w-6 rounded bg-gray-100" />
          </td>

          {/* Actions */}
          {canEdit && (
            <td className="px-4 py-4">
              <div className="flex gap-2">
                <div className="h-4 w-8 rounded bg-gray-100" />
                <div className="h-4 w-8 rounded bg-gray-100" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}
