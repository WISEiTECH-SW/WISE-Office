import React, { useState, useMemo, useEffect, useRef } from "react";

interface Props {
    value: string;
    onChange: (time: string) => void;
    placeholder?: string;
    className?: string;
    options: string[];
}

export default function TimeSelect({
    value,
    onChange,
    placeholder = "--:--",
    className = "",
    options,
}: Props) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 필터링
    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter((t) => t.includes(search));
    }, [search, options]);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full  screen-only">
            <input
                value={open ? search : value}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className={`w-full py-2 text-sm text-center border border-gray-300 rounded-md ${className}`}
            />

            {open && (
                <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md shadow">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((t) => (
                            <div
                                key={t}
                                onClick={() => {
                                    onChange(t);
                                    setSearch("");
                                    setOpen(false);
                                }}
                                className="px-2 py-1 text-sm hover:bg-blue-100 cursor-pointer"
                            >
                                {t}
                            </div>
                        ))
                    ) : (
                        <div className="px-2 py-1 text-sm text-gray-400">
                            결과 없음
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
