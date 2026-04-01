import { useMemo } from "react";
import { useLeaveStore } from "@/store/useLeaveStore";
import { buildLeaveHeatmapWeeks } from "@/utils/leaveTracker";

export function useLeaveHeatmap(year: number) {
    const { inputData } = useLeaveStore();

    return useMemo(() => {
        const weeks = buildLeaveHeatmapWeeks(inputData, year);
        const hasEntries = weeks.some((week) =>
            week.days.some((day) => day.entries.length > 0),
        );

        return {
            weeks,
            hasEntries,
        };
    }, [inputData, year]);
}
