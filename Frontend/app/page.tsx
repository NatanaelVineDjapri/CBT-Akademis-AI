"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { me } from "../services/AuthServices";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    me()
      .then((user) => {
        if (user.role === "admin_akademis_ai") router.replace("/admin-akademis");
        else if (user.role === "admin_universitas") router.replace("/admin-universitas");
        else if (user.role === "dosen") router.replace("/dosen");
        else if (user.role === "mahasiswa") router.replace("/mahasiswa");
        else if (user.role === "peserta_mahasiswa_baru") router.replace("/pmb");
        else router.replace("/login");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, []);

  return null;
}
