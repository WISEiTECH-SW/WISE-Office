import "@/styles/globals.css";
import Link from "next/link";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import HeaderAuth from "@/components/header/HeaderAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getMyProfile } from "@/services/members";

import { User } from "lucide-react";
const logo = "logo.png";

export default function MyApp({ Component, pageProps }: AppProps) {
    const setHasToken = useAuthStore((s) => s.setHasToken);

    useEffect(() => {
        const initAuth = async () => {
            const loggedIn =
                typeof window !== "undefined"
                    ? document.cookie.includes("jwt=")
                    : false;

            setHasToken(loggedIn);

            try {
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
        };

        initAuth();
    }, [setHasToken]);

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
