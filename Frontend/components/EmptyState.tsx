import Image from "next/image";

interface Props {
  message?: string;
  flat?: boolean;
  /** Ukuran maskot dalam px (default 80) */
  size?: number;
}

export default function EmptyState({ message = "Tidak ada data.", flat, size = 80 }: Props) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-2.5 text-center">
      <Image
        src="/images/maskot-binggung.webp"
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain select-none pointer-events-none"
      />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );

  if (flat) {
    return (
      <div className="w-full px-6 py-8 flex items-center justify-center">
        {content}
      </div>
    );
  }
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-10 flex items-center justify-center">
      {content}
    </div>
  );
}
