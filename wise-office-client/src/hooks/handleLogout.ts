import { readLoggedIn } from "@/lib/common/readLoggedIn";
import { toastMessage } from "@/lib/common/toastMessage";
import { logout } from "@/services/members";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";

export const handleLogout = async (type: string) => {
    try {
        const res = await logout();
        if (res === 200) {
            const isLoggedIn = await readLoggedIn();
            useAuthStore.setState({ hasToken: isLoggedIn });
            localStorage.removeItem("expiredAt");
            sessionStorage.removeItem("loginToastShown"); // 다음 로그인 때 토스트 다시 뜨도록
            sessionStorage.setItem("lastLoggedIn", "false");
            useProfileStore.getState().reset();

            if (type === "logout") toastMessage.success("로그아웃되었습니다.");
            if (type === "timeover")
                toastMessage.info("로그인 시간이 만료되었습니다.");
        }
    } catch (error) {
        // 로그아웃 에러
        console.log("로그아웃 에러: ", error);
    }
};
