import { useMutation, useQuery } from "@tanstack/react-query";
import { getLogList } from "@/services/logs";
import { getProjectById } from "@/services/projects";
import { getMinuteList } from "@/services/minutes";
import { createApprove } from "@/services/documents";

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

// 품의서 생성
export const useApproveCreation = () => {
    return useMutation({
        mutationFn: ({
            projectId,
            minutesId,
        }: {
            projectId: number;
            minutesId: number;
        }) => createApprove(projectId, minutesId),
    });
};
