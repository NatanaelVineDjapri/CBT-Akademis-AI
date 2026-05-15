interface Props {
  count: number;
}

export default function HasilUjianTableSkeleton({ count }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50 animate-pulse">
          {[...Array(8)].map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
