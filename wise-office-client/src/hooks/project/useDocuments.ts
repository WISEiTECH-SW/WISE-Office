import { useQuery } from "@tanstack/react-query";
import { getLogList } from "@/services/logs";
import { getProjectById } from "@/services/projects";
import { getMinuteList } from "@/services/minutes";

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
        minutes: useQuery({
            queryKey: ["minutes", projectId],
            queryFn: () => getMinuteList(projectId),
        }),
        // approves: useQuery({
        //     queryKey: ["approves", projectId],
        //     queryFn: () => getApprovesList(projectId),
        // }),
    };
};
