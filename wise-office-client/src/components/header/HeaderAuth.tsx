import { useEffect, useState } from "react";
import LoginButton from "@/components/header/LoginButton";
import LogoutButton from "@/components/header/LogoutButton";
import { getMyProfile } from "@/services/members";
import { useProfileStore } from "@/store/useProfileStore";
import Profile from "./Profile";

export default function HeaderAuth() {
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                // 1. 로그인 여부 확인
                const res = await fetch("/api/auth/me", {
                    credentials: "include",
                });
                const { loggedIn } = await res.json();
                setHasToken(loggedIn);

                // 2. 로그인 상태면 프로필 가져와서 store에 저장
                if (loggedIn) {
                    const profile = await getMyProfile();
                    useProfileStore.setState({ profile });
                } else {
                    useProfileStore.setState({ profile: null });
                }
            } catch (err) {
                console.error("auth check 실패:", err);
                setHasToken(false);
                useProfileStore.setState({ profile: null });
            }
        })();
    }, []);

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
