import { useState, useEffect } from "react";

type JoinYearProps = {
    thisYear: number;
    joinYear: number;
};

export default function LeaveHistory({ thisYear, joinYear }: JoinYearProps) {
    const [workingYears, setWorkingYears] = useState<number[]>([thisYear]);

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
            {/* <label className="font-bold text-gray-800 shrink-0">
                연도별 연차 사용 내역
            </label> */}
            <ul>
                {joinYear && joinYear < thisYear ? (
                    workingYears.map((year) => (
                        <li key={year}>
                            <div className="flex border border-gray-200 rounded-full px-6 py-2 gap-6 mb-2">
                                <p className="font-medium">{year}년</p>
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
