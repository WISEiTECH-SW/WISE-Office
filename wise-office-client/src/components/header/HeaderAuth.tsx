import { useEffect, useState } from "react";
import LoginButton from "@/components/header/LoginButton";
import LogoutButton from "@/components/header/LogoutButton";
import Profile from "./Profile";

export default function HeaderAuth() {
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => setHasToken(data.loggedIn));
    }, []);

    if (!hasToken) {
        return <LoginButton />;
    }

    return (
        <div className="flex gap-5">
            <Profile />
            {/* TODO : 로그아웃 기능 구현 */}
            <LogoutButton />
        </div>
    );
}
