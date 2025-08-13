import "@/styles/globals.css";
import type { AppProps } from "next/app";
import LoginButton from "@/components/LoginButton";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-between items-center bg-blue-600 text-white p-4">
                <h1 className="text-lg font-bold">Wise Office</h1>
                <LoginButton />
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
