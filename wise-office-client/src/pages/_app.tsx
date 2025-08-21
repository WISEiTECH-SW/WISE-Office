import "@/styles/globals.css";
import Link from "next/link";
import type { AppProps } from "next/app";
import HeaderAuth from "@/components/header/HeaderAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useInitAuth } from "@/hooks/useInitAuth";
import { useAuthLoginToast } from "@/hooks/useLoginToast";
import { useRouteGuard } from "@/hooks/useRouteGuard";

import { User } from "lucide-react";
const logo = "logo.png";

export default function MyApp({ Component, pageProps }: AppProps) {
    useInitAuth();
    useAuthLoginToast();
    useRouteGuard();

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
                <ToastContainer className="mt-20" limit={3} />
            </main>

            <footer className="bg-gray-800 text-white p-4 text-center text-sm">
                © 2025 Wise Office. All rights reserved.
            </footer>
        </div>
    );
}
