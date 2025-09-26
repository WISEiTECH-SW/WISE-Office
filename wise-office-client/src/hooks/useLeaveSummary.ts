import { useMemo } from "react";
import { useLeaveStore } from "@/store/useLeaveStore";

const DEDUCTION = new Set(["연차", "반차(오후)", "반차(오전)", "반반차"]);
const SUBSTITUTE = new Set(["대체반차(오전)", "대체반차(오후)", "대체"]);
const DEFENSE = new Set(["국방(반차)", "국방"]);

function isOverOneYear(today: Date, joinDate: string) {
    const d = new Date(joinDate);
    const plusOneYear = new Date(d);
    plusOneYear.setFullYear(plusOneYear.getFullYear() + 1);
    return today >= plusOneYear;
}

export function useLeaveSummary(params: {
    today: Date;
    joinDate?: string;
    thisYear: number;
    joinYear: number;
}) {
    const { inputData } = useLeaveStore();
    const { today, joinDate, thisYear, joinYear } = params;

    return useMemo(() => {
        if (!joinDate) {
            return {
                annualAvailable: 0,
                annualUsed: 0,
                annualRemaining: 0,
                substituteLeaveUsed: 0,
                officialLeaveUsed: 0,
                defenseLeaveUsed: 0,
            };
        }

        const annualAvailable = isOverOneYear(today, joinDate)
            ? (thisYear - joinYear) * 15
            : 11;

        const sums = inputData.reduce(
            (acc, row) => {
                const days = Number(row.days) || 0;
                const category = row.category;

                if (DEDUCTION.has(category)) acc.annualUsed += days;
                if (SUBSTITUTE.has(category)) acc.substituteLeaveUsed += days;
                if (category === "공가") acc.officialLeaveUsed += days;
                if (DEFENSE.has(category)) acc.defenseLeaveUsed += days;

                return acc;
            },
            {
                annualUsed: 0,
                substituteLeaveUsed: 0,
                officialLeaveUsed: 0,
                defenseLeaveUsed: 0,
            }
        );

        const annualRemaining = Math.max(0, annualAvailable - sums.annualUsed);

        return {
            annualAvailable,
            annualUsed: sums.annualUsed,
            annualRemaining,
            substituteLeaveUsed: sums.substituteLeaveUsed,
            officialLeaveUsed: sums.officialLeaveUsed,
            defenseLeaveUsed: sums.defenseLeaveUsed,
        };
    }, [today, joinDate, thisYear, joinYear, inputData]);
}

/** 특정 year에 해당하는 사용량만 합산해서 반환 */
export function useLeaveSummaryByYear(year: number) {
    const { inputData } = useLeaveStore();

    return useMemo(() => {
        const sums = inputData.reduce(
            (acc, row) => {
                const inputDataYear = Number(
                    row.date.split(" ")[0]?.split("-")[0]
                );

                if (year !== inputDataYear) return acc;

                const days = Number(row.days) || 0;
                const cat = row.category;

                if (DEDUCTION.has(cat)) acc.annualUsed += days;
                if (SUBSTITUTE.has(cat)) acc.substituteLeaveUsed += days;
                if (cat === "공가") acc.officialLeaveUsed += days;
                if (DEFENSE.has(cat)) acc.defenseLeaveUsed += days;

                return acc;
            },
            {
                annualUsed: 0,
                substituteLeaveUsed: 0,
                officialLeaveUsed: 0,
                defenseLeaveUsed: 0,
            }
        );

        return sums;
    }, [inputData, year]);
}
