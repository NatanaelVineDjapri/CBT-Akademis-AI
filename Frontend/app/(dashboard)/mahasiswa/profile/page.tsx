"use client";

import { useState } from "react";
import { useUser } from "../../../../context/UserContext";
import ProfileCard from "../../../../components/profile/ProfileCard";
import AkademikCard from "../../../../components/profile/AkademikCard";
import KeamananCard from "../../../../components/profile/KeamananCard";
import UbahProfilModal from "../../../../components/profile/UbahProfilModal";
import UbahPasswordModal from "../../../../components/profile/UbahPasswordModal";

export default function MahasiswaProfilPage() {
  const { user, refreshUser } = useUser();
  const [showUbahProfil, setShowUbahProfil] = useState(false);
  const [showUbahPassword, setShowUbahPassword] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Profil</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola informasi profil dan pengaturan akun Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileCard user={user} onUbahProfil={() => setShowUbahProfil(true)} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AkademikCard user={user} />
          <KeamananCard onUbahPassword={() => setShowUbahPassword(true)} />
        </div>
      </div>

      {showUbahProfil && (
        <UbahProfilModal
          user={user}
          onClose={() => setShowUbahProfil(false)}
          onSaved={refreshUser}
        />
      )}

      {showUbahPassword && (
        <UbahPasswordModal onClose={() => setShowUbahPassword(false)} />
      )}
    </>
  );
}
