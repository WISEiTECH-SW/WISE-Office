import LoginButton from "@/components/header/LoginButton";
import LogoutButton from "@/components/header/LogoutButton";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import Profile from "./Profile";

export default function HeaderAuth() {
    const hasToken = useAuthStore((s) => s.hasToken);

    if (!hasToken) {
        return (
            <div className="flex items-center gap-3">
                <LoginButton />
                <Link href="/login">
                    <span className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md cursor-pointer hover:bg-gray-800">
                        로그인
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex gap-5">
            <Profile />
            <LogoutButton />
        </div>
    );
}
