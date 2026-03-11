import { useQuery } from "@tanstack/react-query";
import { getMinute } from "@/services/minutes";

export const useMinutesDetail = (
    projectId: number,
    minutesId: number | null,
) => {
    const minuteQuery = useQuery({
        queryKey: ["minutes", projectId, minutesId],
        queryFn: () => getMinute(projectId, minutesId!),
        enabled: !!minutesId,
    });

    return {
        minute: minuteQuery.data,
        isMinuteLoading: minuteQuery.isLoading,
    };
};
