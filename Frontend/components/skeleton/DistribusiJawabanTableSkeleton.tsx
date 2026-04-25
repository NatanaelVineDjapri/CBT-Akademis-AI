interface Props {
  count: number;
  cols: number;
}

export default function DistribusiJawabanTableSkeleton({ count, cols }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          {[...Array(cols)].map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
