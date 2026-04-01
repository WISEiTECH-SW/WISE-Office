import { useEffect } from "react";
import { useRouter } from "next/router";
import { toastMessage } from "@/lib/common/toastMessage";
import { useAuthStore } from "@/store/useAuthStore";

export function useRouteGuard() {
    const router = useRouter();
    const { hasToken } = useAuthStore();

    useEffect(() => {
        if (router.query.toast === "login_required") {
            toastMessage.info("로그인이 필요한 페이지입니다.");

            if (hasToken) {
                router.push("/");
            } else {
                router.replace("/auth/login", undefined, { shallow: true });
            }
        }
    }, [router]);
}
