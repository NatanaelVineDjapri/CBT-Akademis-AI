"use client";

import { User } from "../../types";
import Avatar from "../Avatar";

interface Props {
  user: User;
  onUbahProfil: () => void;
}

export default function ProfileCard({ user, onUbahProfil }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-primary)"  }}>
        Informasi Pribadi
      </h2>

      <div className="flex justify-center mb-5">
        <Avatar user={user} size={96} />
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500">Nama Lengkap</label>
          <div className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
            {user.nama || "-"}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">{user.role === "dosen" ? "NIDN" : "NIM"}</label>
          <div className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
            {(user.role === "dosen" ? user.nidn : user.nim) || "-"}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">Email</label>
          <div className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
            {user.email || "-"}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">Nomor Telepon</label>
          <div className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
            {user.no_telp || "-"}
          </div>
        </div>
      </div>

      <button
        onClick={onUbahProfil}
        className="mt-5 w-full text-white text-sm font-medium py-2.5 rounded-lg cursor-pointer"
        style={{ backgroundColor: "var(--color-primary)"  }}
      >
        Ubah Profil
      </button>
    </div>
  );
}
