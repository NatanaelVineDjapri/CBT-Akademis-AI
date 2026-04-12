interface Props {
  message?: string;
}

export default function EmptyState({ message = "Tidak ada data." }: Props) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 flex items-center justify-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
