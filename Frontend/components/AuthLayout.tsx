interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <img
        src="/images/auth-picture.webp"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/80" />

      {/* Card di tengah */}
      <div className="relative z-10 bg-white rounded-3xl shadow-xl p-10 w-full max-w-md mx-4 ">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img
            src="/images/akademis-logo-horizontal.webp"
            alt="logo"
            className="h-16 w-auto mb-2"
          />{" "}
        </div>
        <div className="border-t border-gray-300 my-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

        {children}
      </div>
    </div>
  );
}
