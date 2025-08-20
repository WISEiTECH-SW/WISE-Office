import "@/styles/globals.css";
import Link from "next/link";
import type { AppProps } from "next/app";
import HeaderAuth from "@/components/header/HeaderAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getMyProfile } from "@/services/members";

import { User } from "lucide-react";
import { useEffect } from "react";
const logo = "logo.png";

export default function MyApp({ Component, pageProps }: AppProps) {
    const setHasToken = useAuthStore((s) => s.setHasToken);

    useEffect(() => {
        (async () => {
            try {
                // 1. 로그인 여부 확인
                const res = await fetch("/api/auth/me", {
                    credentials: "include",
                });
                const { loggedIn } = await res.json();
                setHasToken(loggedIn);

                // 2. 로그인 상태면 프로필 가져와서 store에 저장
                if (loggedIn) {
                    const profile = await getMyProfile();
                    useProfileStore.setState({ profile });
                } else {
                    useProfileStore.setState({ profile: null });
                }
            } catch (err) {
                console.error("auth check 실패:", err);
                setHasToken(false);
                useProfileStore.setState({ profile: null });
            }
        })();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-between items-center bg-blue-600 text-white p-4">
                <Link href="/" className="text-lg font-bold">
                    <h1>Wise Office</h1>
                </Link>
                <HeaderAuth />
            </header>

            <main className="flex-grow p-4">
                <Component {...pageProps} />
            </main>

            <footer className="bg-gray-800 text-white p-4 text-center text-sm">
                © 2025 Wise Office. All rights reserved.
            </footer>
        </div>
    );
}
