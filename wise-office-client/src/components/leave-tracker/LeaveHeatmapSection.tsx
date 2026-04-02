import { useLeaveStore } from "@/store/useLeaveStore";
import {
    getTrackedLeaveYears,
    LEAVE_GROUP_META,
    LEAVE_GROUP_ORDER,
} from "@/utils/leaveTracker";
import { useEffect, useMemo, useState } from "react";
import YearlyLeaveHeatmapCard from "./YearlyLeaveHeatmapCard";

export default function LeaveHeatmapSection() {
    const { inputData } = useLeaveStore();
    const availableYears = useMemo(
        () => getTrackedLeaveYears(inputData),
        [inputData],
    );
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    useEffect(() => {
        if (availableYears.length === 0) {
            setSelectedYear(null);
            return;
        }

        setSelectedYear((currentYear) => {
            if (currentYear !== null && availableYears.includes(currentYear)) {
                return currentYear;
            }

            return availableYears[availableYears.length - 1];
        });
    }, [availableYears]);

    const selectedYearIndex =
        selectedYear === null ? -1 : availableYears.indexOf(selectedYear);
    const canMovePrev = selectedYearIndex > 0;
    const canMoveNext =
        selectedYearIndex >= 0 && selectedYearIndex < availableYears.length - 1;

    return (
        <div className="mb-8 border-b border-gray-200 pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-lg font-semibold text-gray-900">
                        연도별 휴가 히트맵
                    </p>
                </div>
                {selectedYear !== null ? (
                    <div className="inline-flex items-center gap-4 self-start rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm">
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedYear(
                                    availableYears[selectedYearIndex - 1],
                                )
                            }
                            disabled={!canMovePrev}
                            className="cursor-pointer rounded-full px-2 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                        >
                            {"<"}
                        </button>
                        <span>{selectedYear}</span>
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedYear(
                                    availableYears[selectedYearIndex + 1],
                                )
                            }
                            disabled={!canMoveNext}
                            className="cursor-pointer rounded-full px-2 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                        >
                            {">"}
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600">
                {LEAVE_GROUP_ORDER.map((group) => (
                    <div key={group} className="flex items-center gap-2">
                        <span
                            className="h-3 w-3 rounded-sm"
                            style={{
                                backgroundColor: LEAVE_GROUP_META[group].color,
                            }}
                        />
                        <span>{LEAVE_GROUP_META[group].label}</span>
                    </div>
                ))}
            </div>

            {selectedYear === null ? (
                <p className="mt-4 text-sm text-gray-500">
                    승인된 휴가 데이터가 있으면 연도별 휴가 히트맵이 표시됩니다.
                </p>
            ) : (
                <div className="mt-6">
                    <YearlyLeaveHeatmapCard year={selectedYear} />
                </div>
            )}
        </div>
    );
}
