import Head from "next/head";
import "@/styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderAuth from "@/components/header/HeaderAuth";
import Toolbar from "@/components/header/Toolbar";
import { useInitAuth } from "@/hooks/useInitAuth";
import { useAuthLoginToast } from "@/hooks/useLoginToast";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { handleLogout } from "@/hooks/handleLogout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React-Query 설정
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const { hasToken } = useAuthStore();
    useInitAuth();
    useAuthLoginToast();
    useRouteGuard();

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const TOP_OFFSET = 96; // 이 높이 이하에서는 항상 헤더 보이기

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < TOP_OFFSET || window.scrollY < lastScrollY) {
                // 스크롤 ↑
                setShowHeader(true);
            } else {
                // 스크롤 ↓
                setShowHeader(false);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const expiredAt = localStorage.getItem("expiredAt");

        if (!hasToken || !expiredAt) return;

        const expiredAtMs = new Date(expiredAt).getTime();

        const EARLY = 5000;
        const deadline = expiredAtMs - EARLY;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const schedule = () => {
            if (timer) clearTimeout(timer);
            const remaining = deadline - Date.now();

            if (remaining <= 0) {
                handleLogout("timeover");
                router.replace("/");
                return;
            }

            timer = setTimeout(() => {
                if (Date.now() >= deadline) {
                    handleLogout("timeover");
                    router.replace("/");
                } else {
                    schedule();
                }
            }, remaining);
        };

        schedule();

        const onVisibility = () => {
            if (!document.hidden) schedule();
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            if (timer) clearTimeout(timer);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [hasToken, router]);

    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <title>Wise Office</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className="min-h-screen flex flex-col">
                <header
                    className={`fixed top-0 left-0 right-0 z-50 flex flex-col transition-transform duration-300
                ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
                >
                    <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                        <Link href="/" className="text-lg font-bold">
                            <Image
                                src="/logo.png"
                                alt="Wise Office Logo"
                                className="h-10 w-auto"
                                width={120}
                                height={48}
                            />
                        </Link>
                        <HeaderAuth />
                    </div>
                    <Toolbar />
                </header>

                <main className="flex-grow p-4 mt-24">
                    <Component {...pageProps} />
                    <ToastContainer className="mt-25" limit={1} />
                </main>
            </div>

            <footer className="bg-gray-800 text-white p-4 text-center text-sm">
                © 2025 Wise Office. All rights reserved.
            </footer>
        </QueryClientProvider>
    );
}
