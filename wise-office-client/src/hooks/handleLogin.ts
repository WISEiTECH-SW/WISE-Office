import { readLoggedIn } from "@/lib/common/readLoggedIn";
import { getMyProfile, login } from "@/services/members";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";

export const handleLogin = async ({
    email,
    password,
    save,
}: {
    email: string;
    password: string;
    save: boolean;
}) => {
    try {
        const res = await login({ email, password });

        // 로그인 상태 확인 후 hastoken 상태 변경
        const loggedIn = await readLoggedIn();
        useAuthStore.setState({ hasToken: loggedIn });

        if (loggedIn) {
            try {
                const profile = await getMyProfile();
                useProfileStore.setState({ profile });
            } catch {
                useProfileStore.setState({ profile: null });
            }
        } else {
            useProfileStore.setState({ profile: null });
        }

        if (save) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
        } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
        }

        return { ok: 200 };
    } catch (error: any) {
        const status: number | undefined = error?.response?.status;
        const message: string | undefined = error?.response?.data?.message;

        return { status, message };
    }
};
