import { useQuery } from "@tanstack/react-query";
import { getLogList } from "@/services/logs";
import { getProjectById } from "@/services/projects";

export const useProjectDetail = (projectId: number) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId),
    });
};

export const useDocumentLists = (projectId: number) => {
    return {
        logs: useQuery({
            queryKey: ["logs", projectId],
            queryFn: () => getLogList(projectId),
        }),
        /* 회의록, 품의서 API 필요 */
        // minutes: useQuery({
        //     queryKey: ["minutes", projectId],
        //     queryFn: () => getMinutesList(projectId),
        // }),
        // approves: useQuery({
        //     queryKey: ["approves", projectId],
        //     queryFn: () => getApprovesList(projectId),
        // }),
    };
};
