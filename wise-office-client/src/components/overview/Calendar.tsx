import { useState, useEffect, useRef } from "react";
import { useOverviewStore } from "@/store/useOverviewStore";
import { menus } from "@/lib/data/overview";

const days = ["일", "월", "화", "수", "목", "금", "토"];

export default function Calendar() {
    const years = menus.map((m) => m.year).sort((a, b) => b - a);
    const { year, month, setYear, setMonth } = useOverviewStore();

    const [openYear, setOpenYear] = useState(false);
    const [openMonth, setOpenMonth] = useState(false);

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const dates: { day: number; dim: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        dates.push({ day: prevMonthLastDate - i, dim: true });
    }

    for (let i = 1; i <= lastDate; i++) {
        dates.push({ day: i, dim: false });
    }

    while (dates.length % 7 !== 0) {
        dates.push({ day: dates.length - lastDate - firstDay + 1, dim: true });
    }

    const changeMonth = (diff: number) => {
        const newDate = new Date(year, month + diff, 1);
        setYear(newDate.getFullYear());
        setMonth(newDate.getMonth());
    };

    // 바깥 클릭 감지
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpenYear(false);
                setOpenMonth(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="w-56 rounded-xl border border-gray-200 p-3 text-sm"
        >
            <div className="flex items-center justify-between mb-2">
                <button
                    className="cursor-pointer px-2"
                    onClick={() => changeMonth(-1)}
                >
                    ‹
                </button>

                <div className="flex gap-2">
                    {/* 연도 드롭다운 */}
                    <button className="relative rounded-md">
                        <button
                            onClick={() => {
                                setOpenYear(!openYear);
                                setOpenMonth(false);
                            }}
                            className="px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                            {year}년
                        </button>

                        {openYear && (
                            <div className="absolute z-10 mt-1 w-20 rounded-md border border-gray-300 bg-white shadow">
                                {years.map((y) => (
                                    <div
                                        key={y}
                                        onClick={() => {
                                            setYear(y);
                                            setOpenYear(false);
                                        }}
                                        className={`px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 ${
                                            y === year
                                                ? "bg-blue-500 text-white"
                                                : ""
                                        }`}
                                    >
                                        {y}년
                                    </div>
                                ))}
                            </div>
                        )}
                    </button>

                    {/* 월 드롭다운 */}
                    <button className="relative">
                        <button
                            onClick={() => {
                                setOpenMonth(!openMonth);
                                setOpenYear(false);
                            }}
                            className="px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                            {month + 1}월
                        </button>

                        {openMonth && (
                            <div className="absolute z-10 mt-1 w-20 rounded-md border border-gray-300 bg-white shadow">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setMonth(i);
                                            setOpenMonth(false);
                                        }}
                                        className={`px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 ${
                                            i === month
                                                ? "bg-blue-500 text-white"
                                                : ""
                                        }`}
                                    >
                                        {i + 1}월
                                    </div>
                                ))}
                            </div>
                        )}
                    </button>
                </div>

                <button
                    className="cursor-pointer px-2"
                    onClick={() => changeMonth(1)}
                >
                    ›
                </button>
            </div>

            <div className="grid grid-cols-7 text-xs text-gray-400 mb-1">
                {days.map((d) => (
                    <div key={d} className="text-center">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
                {dates.map((d, i) => (
                    <div
                        key={i}
                        className={`py-1 rounded-md ${
                            d.dim ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                        {d.day}
                    </div>
                ))}
            </div>
        </div>
    );
}
