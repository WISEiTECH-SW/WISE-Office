import LoginButton from "@/components/header/LoginButton";
import LogoutButton from "@/components/header/LogoutButton";
import Profile from "./Profile";
import { useAuthStore } from "@/store/useAuthStore";

export default function HeaderAuth() {
    const hasToken = useAuthStore((s) => s.hasToken);

    if (!hasToken) {
        return <LoginButton />;
    }

    return (
        <div className="flex gap-5">
            <Profile />
            <LogoutButton />
        </div>
    );
}
