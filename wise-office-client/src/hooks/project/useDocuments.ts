import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/services/projects";
import { getPossibleAttendantsList } from "@/services/documents";

/** 프로젝트 상세 조회 */
export const useProjectDetail = (projectId: number) =>
    useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId),
    });

/** 회의록 참여자별 가능여부 조회 */
export const usePossibleAttendantsList = (
    projectId: number,
    minutesDate: string,
) =>
    useQuery({
        queryKey: ["possibleAttendants", projectId, minutesDate],
        queryFn: () => getPossibleAttendantsList(projectId, minutesDate),
        enabled: !!projectId && !!minutesDate,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
    });
