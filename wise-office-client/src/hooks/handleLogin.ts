import { readLoggedIn } from "@/lib/common/readLoggedIn";
import { getMyProfile, login } from "@/services/members";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import axios from "axios";

type ApiErrorBody = { message?: string };

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
        localStorage.setItem("expiredAt", res);
        // 로그인 상태 확인 후 hastoken 상태 변경
        const loggedIn = await readLoggedIn();
        useAuthStore.setState({ hasToken: loggedIn });

        if (loggedIn) {
            try {
                const profile = await getMyProfile();
                useProfileStore.setState({ profile });
            } catch {
                useProfileStore.getState().reset();
            }
        } else {
            useProfileStore.getState().reset();
        }

        if (save) localStorage.setItem("email", email);
        else localStorage.removeItem("email");

        return { ok: 200 };
    } catch (error: unknown) {
        let status: number | undefined;
        let message: string | undefined;

        if (axios.isAxiosError<ApiErrorBody>(error)) {
            status = error.response?.status;
            message = error.response?.data?.message;
        } else if (error instanceof Error) {
            message = error.message;
        } else {
            message = "Unknown error";
        }

        return { status, message };
    }
};
