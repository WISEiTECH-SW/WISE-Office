import { useMemo } from "react";
import { useLeaveStore } from "@/store/useLeaveStore";

const DEDUCTION = new Set(["연차", "반차(오후)", "반차(오전)", "반반차"]);
const SUBSTITUTE = new Set(["대체반차(오전)", "대체반차(오후)", "대체"]);
const DEFENSE = new Set(["국방(반차)", "국방"]);

function workingYears(start: Date, end: Date): number {
    if (end < start) return 0;
    let years = end.getFullYear() - start.getFullYear();
    if (
        end.getMonth() < start.getMonth() ||
        (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
    ) {
        years -= 1;
    }
    return Math.max(0, years);
}

function workingMonths(start: Date, end: Date): number {
    if (end < start) return 0;
    let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
    if (end.getDate() < start.getDate()) months -= 1;
    return Math.max(0, months);
}

export function useLeaveSummary(params: { today: Date; joinDate?: string }) {
    const { inputData } = useLeaveStore();
    const { today, joinDate } = params;

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

        const joinDate_Date = joinDate ? new Date(joinDate) : undefined;

        // joinDate가 없거나 미래 : annualAvailable = 0
        let annualAvailable = 0;
        if (!joinDate_Date || today < joinDate_Date) {
            annualAvailable = 0;
        } else {
            // 근속년수 계산
            const years = workingYears(joinDate_Date, today);
            if (years < 1) {
                // 1년 미만 : 월차
                const n = workingMonths(joinDate_Date, today);
                annualAvailable = n;
            } else {
                // 근속 3년마다 연차 +1
                const extraLeavesPerThreeYears = Math.floor(years / 3);
                // 1년 이상: 연차 (+15)
                annualAvailable = 11 + years * 15 + extraLeavesPerThreeYears;
            }
        }

        const sums = inputData.reduce(
            (acc, row) => {
                const days = Number(row.days) || 0;
                const category = row.category;

                if (DEDUCTION.has(category) && row.status === "결재")
                    acc.annualUsed += days;
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
            },
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
    }, [today, joinDate, inputData]);
}

/** 특정 year에 해당하는 사용량만 합산해서 반환 */
export function useLeaveSummaryByYear(year: number) {
    const { inputData } = useLeaveStore();

    return useMemo(() => {
        const sums = inputData.reduce(
            (acc, row) => {
                const inputDataYear = Number(
                    row.date.split(" ")[0]?.split("-")[0],
                );

                if (year !== inputDataYear) return acc;

                const days = Number(row.days) || 0;
                const cat = row.category;

                if (DEDUCTION.has(cat) && row.status === "결재")
                    acc.annualUsed += days;
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
            },
        );

        return sums;
    }, [inputData, year]);
}
