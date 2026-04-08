"use client";

import { User } from "../services/AuthServices";

interface Props {
  user: User;
  size?: number;
  className?: string;
}

export default function Avatar({ user, size = 36, className = "" }: Props) {
  if (user.foto) {
    return (
      <img
        src={user.foto}
        alt={user.nama}
        width={size}
        height={size}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: "var(--color-primary)", fontSize: size * 0.4 }}
    >
      {user.nama?.charAt(0).toUpperCase()}
    </div>
  );
}
