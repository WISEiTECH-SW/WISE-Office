import { useRouter } from "next/router";
import Link from "next/link";
import LogoutButton from "@/components/header/LogoutButton";
import ProfileImage from "./ProfileImage";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";

export default function HeaderAuth() {
    const router = useRouter();
    const hasToken = useAuthStore((s) => s.hasToken);
    const { profile } = useProfileStore();

    const handleProfileClick = () => {
        router.push("/account");
    };

    if (!hasToken) {
        return (
            <div className="flex items-center gap-3">
                <Link href="/auth/login">
                    <span className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md cursor-pointer hover:bg-gray-700">
                        로그인
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex gap-5">
            <div
                onClick={handleProfileClick}
                className="relative w-10 h-10 flex-none rounded-full overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
            >
                <ProfileImage imageUrl={profile?.imageUrl} />
            </div>
            <LogoutButton />
        </div>
    );
}
