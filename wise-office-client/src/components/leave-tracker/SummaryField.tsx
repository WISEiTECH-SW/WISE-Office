import { useMemo, useState } from "react";
import SummaryCard from "@/components/leave-tracker/SummaryCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { dateToString } from "@/utils/dateToString";

type JoinDateProps = {
    today: Date;
    joinDate: string;
    thisYear: number;
    joinYear: number;
};
export default function SummaryField({
    today,
    joinDate,
    thisYear,
    joinYear,
}: JoinDateProps) {
    const [showMore, setShowMore] = useState(false);

    function isOverOneYear(today: Date, joinDate: string): boolean {
        const plusOneYear = new Date(joinDate);
        plusOneYear.setFullYear(plusOneYear.getFullYear() + 1);
        return dateToString(today) >= dateToString(plusOneYear);
    }

    const data = useMemo(() => {
        if (!joinDate) {
            return {
                annualAvailable: 0.0,
                annualUsed: 0.0,
                annualRemaining: 0.0,
                compLeaveUsed: 0.0,
                officialLeaveUsed: 0.0,
                defenseLeaveUsed: 0.0,
            };
        }

        const annualAvailable = isOverOneYear(today, joinDate)
            ? (thisYear - joinYear) * 15
            : 11;

        return {
            annualAvailable,
            annualUsed: 0.0,
            annualRemaining: 0.0,
            compLeaveUsed: 0.0,
            officialLeaveUsed: 0.0,
            defenseLeaveUsed: 0.0,
        };
    }, [joinDate]);

    return (
        <div className="mt-6 px-2">
            {/* <label className="font-bold text-gray-800 shrink-0">요약</label> */}

            {/* 상단 3개 */}
            <div className="grid grid-cols-3 gap-3">
                <SummaryCard
                    title="사용가능한 연차"
                    count={data.annualAvailable}
                    bg="bg-gray-100"
                />
                <SummaryCard
                    title="사용한 연차"
                    count={data.annualUsed}
                    bg="bg-gray-100"
                />
                <SummaryCard
                    title="잔여 연차"
                    count={data.annualRemaining}
                    bg="bg-blue-100"
                />
            </div>

            <div className="flex justify-center mt-2">
                <button
                    onClick={() => setShowMore((prev) => !prev)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
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
                    <div className="grid grid-cols-3 gap-3 mt-1">
                        <SummaryCard
                            title="사용한 대체휴가"
                            count={data.compLeaveUsed}
                            bg="bg-gray-100"
                        />
                        <SummaryCard
                            title="사용한 공가휴가"
                            count={data.officialLeaveUsed}
                            bg="bg-gray-100"
                        />
                        <SummaryCard
                            title="사용한 국방휴가"
                            count={data.defenseLeaveUsed}
                            bg="bg-gray-100"
                        />
                    </div>
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => setShowMore((prev) => !prev)}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
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
