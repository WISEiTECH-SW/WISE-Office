import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { getPossibleAttendantsList } from "@/services/documents";

export const usePossibleAttendants = (
    projectId: number,
    minutesDate?: string,
) => {
    return useQuery({
        queryKey: queryKeys.possibleAttendants(projectId, minutesDate!),
        queryFn: () => getPossibleAttendantsList(projectId, minutesDate!),
        enabled: !!minutesDate,
    });
};
