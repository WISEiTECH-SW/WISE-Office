import { useLeaveSummaryByYear } from "@/hooks/useLeaveSummary";

export default function SummaryList({ year }: { year: number }) {
    const {
        annualUsed,
        substituteLeaveUsed,
        officialLeaveUsed,
        defenseLeaveUsed,
    } = useLeaveSummaryByYear(year);
    const title = ["연차", "대체휴가", "공가휴가", "국방휴가"];

    return (
        <div className="flex justify-between items-center border border-gray-200 rounded-lg px-6 py-3 gap-6 mb-4 shadow-sm">
            <p className="font-medium">{year}년</p>
            <div className="flex flex-col items-center">
                <p className="text-xs lg:text-sm font-medium">{title[0]}</p>
                <p className="font-base">{annualUsed}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs lg:text-sm font-medium">{title[1]}</p>
                <p className="font-base">{substituteLeaveUsed}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs lg:text-sm font-medium">{title[2]}</p>
                <p className="font-base">{officialLeaveUsed}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs lg:text-sm font-medium">{title[3]}</p>
                <p className="font-base">{defenseLeaveUsed}</p>
            </div>
        </div>
    );
}
