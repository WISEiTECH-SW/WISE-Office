import React, { useState, useEffect } from "react";

type EmailVerifyButtonProps = {
    verifyEmail: () => Promise<boolean>;
    disabled: boolean;
    emailValid: boolean;
};

export default function EmailVerifyButton({
    verifyEmail,
    disabled,
    emailValid,
}: EmailVerifyButtonProps) {
    const [cooldown, setCooldown] = useState(0);

    // 카운트다운 실행
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleClick = async () => {
        const success = await verifyEmail();
        if (success) {
            setCooldown(59);
        }
    };

    const formatTime = (sec: number) => {
        const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
        const seconds = String(sec % 60).padStart(2, "0");
        return ` ${minutes} : ${seconds} `;
    };

    if (emailValid) {
        return (
            <button
                type="button"
                className="w-25 h-10.5 px-4 text-sm font-medium text-white rounded-md whitespace-nowrap bg-gray-300 cursor-not-allowed"
            >
                인증완료
            </button>
        );
    }
    return (
        <button
            type="button"
            className="w-25 h-10.5 px-4 text-sm font-medium text-white bg-gray-600 rounded-md whitespace-nowrap cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={disabled || cooldown > 0}
            onClick={handleClick}
        >
            {cooldown > 0 ? formatTime(cooldown) : "인증요청"}
        </button>
    );
}
