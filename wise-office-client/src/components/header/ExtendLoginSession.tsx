import { extendLoginSession } from "@/services/members";
import { useEffect, useState } from "react";

export default function ExtendLoginSession() {
    const [expiredAt, setExpiredAt] = useState(
        localStorage.getItem("expiredAt"),
    );
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!expiredAt) return;

        // 남은 시간을 계산하는 함수
        const calculateTimeLeft = () => {
            const expirationDate = new Date(expiredAt);
            const now = new Date();
            const difference = expirationDate.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft("만료됨");
                return;
            }

            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(
                `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
            );
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [expiredAt]);

    const extendLogin = async () => {
        const result = confirm("로그인을 연장하시겠습니까?");
        if (result) {
            const newExpiredAt = await extendLoginSession();
            localStorage.setItem("expiredAt", newExpiredAt!);
            setExpiredAt(newExpiredAt);
        }
    };

    return (
        <button onClick={() => extendLogin()}>
            <span className="px-4 py-2 text-sm font-medium text-blue-700 bg-white rounded-md cursor-pointer hover:bg-gray-100">
                {timeLeft}
            </span>
        </button>
    );
}
