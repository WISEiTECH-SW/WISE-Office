import Head from "next/head";
import "@/styles/globals.css";
import Link from "next/link";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderAuth from "@/components/header/HeaderAuth";
import { useInitAuth } from "@/hooks/useInitAuth";
import { useAuthLoginToast } from "@/hooks/useLoginToast";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import Image from "next/image";

export default function MyApp({ Component, pageProps }: AppProps) {
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

    return (
        <>
            <Head>
                <title>Wise Office</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className="min-h-screen flex flex-col">
                <header
                    className={`fixed top-0 left-0 right-0 z-50 
                bg-blue-600 text-white p-4 flex justify-between items-center
                transition-transform duration-300
                ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
                >
                    <Link href="/" className="text-lg font-bold">
                        <Image
                            src="/logo.png"
                            alt="Wise Office Logo"
                            className="h-12 w-auto"
                            width={120}
                            height={48}
                        />
                    </Link>
                    <HeaderAuth />
                </header>

                <main className="min-h-screen flex-grow p-4 mt-20">
                    <Component {...pageProps} />
                    <ToastContainer className="mt-20" limit={3} />
                </main>
            </div>

            <footer className="bg-gray-800 text-white p-4 text-center text-sm">
                © 2025 Wise Office. All rights reserved.
            </footer>
        </>
    );
}
