import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getMyProfile } from "@/services/members";

function isLoggedInByCookie(): boolean {
    if (typeof window === "undefined") return false;
    return document.cookie.split("; ").some((c) => c.startsWith("jwt="));
}

export function useInitAuth() {
    const { setHasToken, setAuthCheck } = useAuthStore();

    useEffect(() => {
        const init = async () => {
            const loggedIn = isLoggedInByCookie();
            setHasToken(loggedIn);

            try {
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
            } finally {
                setAuthCheck(true);
            }
        };

        init();
    }, [setHasToken, setAuthCheck]);
}
