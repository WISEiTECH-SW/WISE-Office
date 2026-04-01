import LogoutButton from "@/components/header/LogoutButton";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import Link from "next/link";
import { useRouter } from "next/router";
import ExtendLoginSession from "./ExtendLoginSession";
import ProfileImage from "./ProfileImage";

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
        <div className="flex gap-4">
            <ExtendLoginSession />
            <LogoutButton />
            <div
                onClick={handleProfileClick}
                className="relative w-8 h-8 flex-none rounded-full overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
            >
                <ProfileImage imageUrl={profile?.imageUrl} />
            </div>
        </div>
    );
}
