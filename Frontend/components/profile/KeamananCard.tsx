"use client";

interface Props {
  onUbahPassword: () => void;
}

export default function KeamananCard({ onUbahPassword }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-primary)" }}>
        Keamanan
      </h2>
      <div>
        <label className="text-xs text-gray-500">Password</label>
        <div className="flex gap-3 mt-1">
          <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 tracking-widest">
            ••••••••••••
          </div>
          <button
            onClick={onUbahPassword}
            className="text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );
}
