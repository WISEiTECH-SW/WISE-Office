import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { isOverOneYear } from "@/utils/dateToString";
import SummaryCard from "@/components/leave-tracker/SummaryCard";
import { useLeaveStore } from "@/store/useLeaveStore";

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
    const { inputData } = useLeaveStore();

    console.log("input: ", inputData);

    const data = useMemo(() => {
        const deduction = ["연차", "반차(오후)", "반차(오전)", "반반차"];
        const substitute = ["대체반차(오전)", "대체반차(오후)", "대체"];
        const defense = ["국방(반차)", "국방"];

        if (!joinDate || inputData.length === 0) {
            return {
                annualAvailable: 0.0,
                annualUsed: 0.0,
                annualRemaining: 0.0,
                substituteLeaveUsed: 0.0,
                officialLeaveUsed: 0.0,
                defenseLeaveUsed: 0.0,
            };
        }

        // 사용가능한 연차 계산
        const annualAvailable = isOverOneYear(today, joinDate)
            ? (thisYear - joinYear) * 15
            : 11;

        var annualUsed = 0.0;
        var substituteLeaveUsed = 0.0;
        var officialLeaveUsed = 0.0;
        var defenseLeaveUsed = 0.0;

        for (let i = 0; i < inputData.length; i++) {
            if (deduction.includes(inputData[i].category))
                annualUsed += Number(inputData[i].days);
            if (substitute.includes(inputData[i].category))
                substituteLeaveUsed += Number(inputData[i].days);
            if (inputData[i].category === "공가")
                officialLeaveUsed += Number(inputData[i].days);
            if (defense.includes(inputData[i].category))
                defenseLeaveUsed += Number(inputData[i].days);
        }

        const annualRemaining = annualAvailable - annualUsed;

        return {
            annualAvailable,
            annualUsed,
            annualRemaining,
            substituteLeaveUsed,
            officialLeaveUsed,
            defenseLeaveUsed,
        };
    }, [joinDate, inputData]);

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
                            count={data.substituteLeaveUsed}
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
