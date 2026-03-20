import { useCallback, useEffect, useState } from "react";

export const useCountDown = (initialSeconds: number) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = window.setTimeout(
            () => setTimeLeft((prev) => prev - 1),
            1000,
        );
        return () => window.clearTimeout(timer);
    }, [timeLeft]);

    const start = useCallback((seconds: number) => setTimeLeft(seconds), []);
    const reset = useCallback(() => setTimeLeft(0), []);

    return { timeLeft, start, reset };
};
