export default function MaintenancePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <img
        src="/images/auth-picture.webp"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 bg-white rounded-3xl shadow-xl p-10 w-full max-w-md mx-4 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/images/akademis-logo-horizontal.webp"
            alt="Akademis AI"
            className="h-16 w-auto"
          />
        </div>

        <div className="border-t border-gray-200 my-4" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Sistem Dalam Pemeliharaan
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Sistem sedang dilakukan pemeliharaan untuk meningkatkan kualitas
          layanan. Kami akan segera kembali. Terima kasih atas kesabaran Anda.
        </p>

        <a
          href="/"
          className="block w-full py-2.5 rounded-lg text-sm font-semibold text-white text-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Coba Lagi
        </a>

        <p className="text-xs text-gray-400 mt-5">
          © {new Date().getFullYear()} Akademis AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
