import { extendLoginSession } from "@/services/members";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

export default function ExtendLoginSession() {
    const [expiredAt, setExpiredAt] = useState<string | null>(null);
    const [minuteLeft, setMinuteLeft] = useState(0);
    const [secondLeft, setSecondLeft] = useState(0);

    useEffect(() => {
        setExpiredAt(localStorage.getItem("expiredAt"));
    }, []);

    useEffect(() => {
        if (!expiredAt) {
            setMinuteLeft(0);
            setSecondLeft(0);
            return;
        }

        // 남은 시간을 계산하는 함수
        const calculateTimeLeft = () => {
            const expirationDate = new Date(expiredAt);
            const now = new Date();
            const difference = expirationDate.getTime() - now.getTime();

            if (difference <= 0) {
                setMinuteLeft(0);
                setSecondLeft(0);
                return true;
            }

            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setMinuteLeft(minutes);
            setSecondLeft(seconds);

            return false;
        };

        //만료된 경우 타이머 동작 X
        if (calculateTimeLeft()) {
            return;
        }

        const timer = setInterval(() => {
            if (calculateTimeLeft()) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiredAt]);

    const extendLogin = async () => {
        const result = confirm("로그인을 연장하시겠습니까?");
        if (result) {
            try {
                const newExpiredAt = await extendLoginSession();
                localStorage.setItem("expiredAt", newExpiredAt);
                setExpiredAt(newExpiredAt);
            } catch (err) {
                console.error("로그인 연장 실패 : ", err);
                alert("로그인 연장이 실패했습니다.");
            }
        }
    };

    return (
        <>
            <div className="flex gap-2 items-center">
                <Timer size={16} />
                <span className="tabular-nums block text-sm font-semibold">
                    {String(minuteLeft).padStart(2, "0")}:
                    {String(secondLeft).padStart(2, "0")}
                </span>
            </div>
            <button
                onClick={() => extendLogin()}
                className="px-4 py-2 text-xs font-medium text-blue-700 bg-white rounded-md cursor-pointer hover:bg-gray-100"
            >
                로그인 연장
            </button>
        </>
    );
}
