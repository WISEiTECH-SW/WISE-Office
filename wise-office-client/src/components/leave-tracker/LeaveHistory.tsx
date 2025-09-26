import { useState, useEffect } from "react";
import { useLeaveStore } from "@/store/useLeaveStore";
import SummaryList from "./SummaryList";

type JoinYearProps = {
    thisYear: number;
    joinYear: number;
};

export default function LeaveHistory({ thisYear, joinYear }: JoinYearProps) {
    const [workingYears, setWorkingYears] = useState<number[]>([thisYear]);
    const { inputData } = useLeaveStore();

    useEffect(() => {
        if (!joinYear || joinYear > thisYear) return;

        const years: number[] = [];
        for (let i = thisYear - 1; i >= joinYear; i--) {
            years.push(i);
        }
        setWorkingYears(years);
    }, [joinYear]);

    return (
        <div className="mt-6">
            <ul>
                {joinYear && inputData.length > 0 ? (
                    workingYears.map((year) => <SummaryList year={year} />)
                ) : (
                    <p className="w-full text-sm text-gray-600">
                        * 입사일을 입력해 연도별 연차 사용 내역을 확인하세요.
                    </p>
                )}
            </ul>
        </div>
    );
}
