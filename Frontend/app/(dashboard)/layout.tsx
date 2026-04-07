"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { me, User } from "../../services/AuthServices";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        me()
            .then(setUser)
            .catch(() => router.replace("/login"));
    }, []);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar user={user} />
            <main className="flex-1 min-w-0 p-8">{children}</main>
        </div>
    );
}
