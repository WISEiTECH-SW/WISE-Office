import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toastMessage } from "@/lib/common/toastMessage";

export function useAuthLoginToast() {
    const { hasToken, authCheck } = useAuthStore();

    useEffect(() => {
        if (!authCheck || typeof window === "undefined") return;

        const prev = sessionStorage.getItem("lastLoggedIn"); // "true" | "false" | null
        const now = hasToken ? "true" : "false";
        const shown = sessionStorage.getItem("loginToastShown") === "1";

        // 로그인 상태로 전환 (false -> true): 세션 내 1회만
        if (prev === "false" && now === "true" && !shown) {
            toastMessage.success("로그인되었습니다.");
            sessionStorage.setItem("loginToastShown", "1");
        }

        // 첫 진입이 이미 로그인 상태(새로고침 포함): 세션 동안 재토스트 방지 플래그
        if (prev === null && now === "true" && !shown) {
            sessionStorage.setItem("loginToastShown", "1");
        }

        sessionStorage.setItem("lastLoggedIn", now);
    }, [authCheck, hasToken]);
}
