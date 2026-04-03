import { useEffect } from "react";

export const useScrollLock = (active: boolean = true) => {
    useEffect(() => {
        if (!active) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [active]);
};
