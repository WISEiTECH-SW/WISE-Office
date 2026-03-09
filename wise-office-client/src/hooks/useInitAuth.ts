import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getMyProfile } from "@/services/members";
import { readLoggedIn } from "@/lib/common/readLoggedIn";

export function useInitAuth() {
    const { setHasToken } = useAuthStore();
    const reset = useProfileStore((s) => s.reset);

    useEffect(() => {
        (async () => {
            try {
                const loggedIn = await readLoggedIn();

                setHasToken(loggedIn);

                if (loggedIn) {
                    const profile = await getMyProfile();
                    useProfileStore.setState({ profile });
                } else {
                    reset();
                }
            } catch (e) {
                console.error("auth init 실패:", e);
                setHasToken(false);
                reset();
            }
        })();
    }, [setHasToken, reset]);
}
