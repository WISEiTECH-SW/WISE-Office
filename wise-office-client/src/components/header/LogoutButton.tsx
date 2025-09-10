import { useRouter } from "next/router";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toastMessage } from "@/lib/common/toastMessage";

export default function LogoutButton() {
    const router = useRouter();
    const reset = useProfileStore((s) => s.reset);
    const setHasToken = useAuthStore((s) => s.setHasToken);

    const deleteCookie = () => {
        document.cookie = "jwt=; Max-age=0; Path=/";
        setHasToken(false);
        reset();
        sessionStorage.removeItem("loginToastShown"); // 다음 로그인 때 토스트 다시 뜨도록
        sessionStorage.setItem("lastLoggedIn", "false");
        toastMessage.success("로그아웃되었습니다.");
        router.push("/");
    };

    return (
        <button onClick={deleteCookie}>
            <span className="px-4 py-2 text-sm font-medium text-blue-700 bg-white rounded-md cursor-pointer hover:bg-gray-100">
                로그아웃
            </span>
        </button>
    );
}
