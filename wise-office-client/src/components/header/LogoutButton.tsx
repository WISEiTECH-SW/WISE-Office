import { useRouter } from "next/router";
import { handleLogout } from "@/hooks/handleLogout";

export default function LogoutButton() {
    const router = useRouter();

    const clickLogout = () => {
        handleLogout("logout");
        router.push("/");
    };

    return (
        <button onClick={clickLogout} className="flex gap-4 items-center">
            <span className="px-4 py-2 text-xs font-medium text-blue-700 bg-white rounded-md cursor-pointer hover:bg-gray-100">
                로그아웃
            </span>
        </button>
    );
}
