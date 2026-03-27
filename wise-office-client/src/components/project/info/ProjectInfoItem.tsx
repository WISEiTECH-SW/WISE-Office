import { useEffect, useRef, useState } from "react";

type ProjectInfoItemProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

export default function ProjectInfoItem({
    icon,
    label,
    value,
}: ProjectInfoItemProps) {
    const textRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState(value);
    const [expanded, setExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        el.innerText = value;

        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        const maxHeight = lineHeight * 2;

        if (el.scrollHeight <= maxHeight) {
            setDisplayText(value);
            setIsClamped(false);
            return;
        }

        setIsClamped(true);

        let start = 0;
        let end = value.length;
        let result = "";

        while (start <= end) {
            const mid = Math.floor((start + end) / 2);
            el.innerText = value.slice(0, mid) + "...더보기";

            if (el.scrollHeight > maxHeight) {
                end = mid - 1;
            } else {
                result = value.slice(0, mid);
                start = mid + 1;
            }
        }

        setDisplayText(result);
    }, [value]);

    return (
        <div className="flex items-start space-x-3 gap-2">
            <div className="text-blue-600 mt-2 md:w-6 md:h-6">{icon}</div>

            <div className="flex-grow min-w-0">
                <div className="text-xs md:text-sm font-semibold text-gray-600">
                    {label}
                </div>
                <div className="text-sm text-gray-800 break-words whitespace-normal">
                    <div ref={textRef}>
                        {expanded ? (
                            <>
                                {value}
                                <button
                                    onClick={() => setExpanded(false)}
                                    className="text-gray-400 ml-1 hover:underline cursor-pointer text-xs"
                                >
                                    ...접기
                                </button>
                            </>
                        ) : !isClamped ? (
                            value
                        ) : (
                            <>
                                {displayText}
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="text-gray-400 ml-1 hover:underline cursor-pointer text-xs"
                                >
                                    ...더보기
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
