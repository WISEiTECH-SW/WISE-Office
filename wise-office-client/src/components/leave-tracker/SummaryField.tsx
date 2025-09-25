"use client";

import { useState } from "react";
import SummaryCard from "@/components/leave-tracker/SummaryCard";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SummaryField() {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="mt-4">
            <label className="font-bold text-gray-800 shrink-0">요약</label>

            {/* 상단 3개 */}
            <div className="grid grid-cols-3 gap-4 mt-2">
                <SummaryCard
                    title="사용가능한 연차"
                    count="0.000"
                    bg="bg-gray-100"
                />
                <SummaryCard
                    title="사용한 연차"
                    count="0.000"
                    bg="bg-gray-100"
                />
                <SummaryCard title="잔여 연차" count="0.000" bg="bg-blue-100" />
            </div>

            <div className="flex justify-center mt-2">
                <button
                    onClick={() => setShowMore((prev) => !prev)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                    {!showMore && (
                        <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            더보기
                        </>
                    )}
                </button>
            </div>

            {showMore && (
                <>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        <SummaryCard
                            title="사용한 대체휴가"
                            count="0.000"
                            bg="bg-gray-100"
                        />
                        <SummaryCard
                            title="사용한 공가휴가"
                            count="0.000"
                            bg="bg-gray-100"
                        />
                        <SummaryCard
                            title="사용한 국방휴가"
                            count="0.000"
                            bg="bg-gray-100"
                        />
                    </div>
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => setShowMore((prev) => !prev)}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                            {showMore && (
                                <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    접기
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
