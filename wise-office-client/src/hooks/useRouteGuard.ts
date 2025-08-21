import { useEffect } from "react";
import { useRouter } from "next/router";
import { toastMessage } from "@/lib/common/toastMessage";

export function useRouteGuard() {
    const router = useRouter();

    useEffect(() => {
        if (router.query.toast === "login_required") {
            toastMessage.info("로그인이 필요한 페이지입니다.");

            router.push("/");
        }
    }, [router]);
}
