import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { User } from "lucide-react";
const logo = "logo.png";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-700 text-white px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="w-50">
                        <img src={logo} alt="로고" />
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-semibold">WISE</div>
                        <div className="text-sm">BACK OFFICE</div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white rounded"></div>
                        </div>
                    </div>
                </div>
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
