import { useQuery } from "@tanstack/react-query";
import { getCommentList } from "@/services/coments";
import { getLogDetail } from "@/services/logs";

export const useLogDetail = (projectId: number, logId: number | null) => {
    const logQuery = useQuery({
        queryKey: ["logs", projectId, logId],
        queryFn: () => getLogDetail(projectId, logId!),
        enabled: !!logId,
    });

    const commentQuery = useQuery({
        queryKey: ["comments", logId],
        queryFn: () => getCommentList(projectId, logId!),
        enabled: !!logId,
    });

    return {
        log: logQuery.data,
        comments: commentQuery.data,
        isLoading: logQuery.isLoading || commentQuery.isLoading,
    };
};
