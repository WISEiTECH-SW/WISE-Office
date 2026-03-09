import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SummaryCard from "./SummaryCard";
import { useLeaveSummary } from "@/hooks/useLeaveSummary";
import JoinDateField from "./JoinDateField";

type JoinDateProps = {
    today: Date;
    joinDate: string;
    setJoinDate: (joinDate: string) => void;
};

export default function SummaryField({
    today,
    joinDate,
    setJoinDate,
}: JoinDateProps) {
    const [showMore, setShowMore] = useState(false);

    const {
        annualAvailable,
        annualUsed,
        annualRemaining,
        substituteLeaveUsed,
        officialLeaveUsed,
        defenseLeaveUsed,
    } = useLeaveSummary({ today, joinDate });

    return (
        <div>
            <div className="flex items-center gap-4 md:gap-10 mb-4">
                <p className="font-bold text-gray-800 shrink-0">
                    전체 연차 사용 현황
                </p>
                <JoinDateField
                    id="hire-date"
                    labelName="입사일"
                    value={joinDate}
                    onChange={setJoinDate}
                    page="leave"
                />
            </div>
            {/* 상단 3개 */}
            <div className="grid grid-cols-3 gap-3">
                <div className="">
                    <SummaryCard
                        title="사용가능한 연차"
                        count={annualAvailable}
                        bg="bg-gray-100"
                    />
                </div>
                <SummaryCard
                    title="사용한 연차"
                    count={annualUsed}
                    bg="bg-gray-100"
                />
                <SummaryCard
                    title="잔여 연차"
                    count={annualRemaining}
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
                            count={substituteLeaveUsed}
                            bg="bg-gray-100"
                        />
                        <SummaryCard
                            title="사용한 공가휴가"
                            count={officialLeaveUsed}
                            bg="bg-gray-100"
                        />
                        <SummaryCard
                            title="사용한 국방휴가"
                            count={defenseLeaveUsed}
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
