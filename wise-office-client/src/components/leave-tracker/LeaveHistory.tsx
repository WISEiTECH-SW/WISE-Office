import { useState, useEffect } from "react";

type HistoryProps = {
    joinDate: string;
};

export default function LeaveHistory({ joinDate }: HistoryProps) {
    const today = new Date();
    const thisYear = Number(today.getFullYear());
    const joinYear = Number(joinDate.split("-")[0]);
    const [workingYears, setWorkingYears] = useState<number[]>([thisYear]);

    useEffect(() => {
        if (!joinYear || joinYear > thisYear) return;

        const years: number[] = [];
        for (let i = thisYear; i >= joinYear; i--) {
            years.push(i);
        }
        setWorkingYears(years);
    }, [joinDate]);

    return (
        <div className="mt-6">
            {/* <label className="font-bold text-gray-800 shrink-0">
                연도별 연차 사용 내역
            </label> */}
            <ul>
                {joinDate ? (
                    workingYears.map((year) => (
                        <li key={year}>
                            <div className="flex border border-gray-200 rounded-full px-6 py-2 gap-6 mb-2">
                                <p className="font-medium">{year}</p>
                                <p className="font-base">0.000</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="w-full text-sm text-gray-600">
                        * 입사일을 입력해 연도별 연차 사용 내역을 확인하세요.
                    </p>
                )}
            </ul>
        </div>
    );
}
