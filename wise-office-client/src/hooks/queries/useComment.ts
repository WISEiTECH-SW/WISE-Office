import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import {
    getCommentList,
    createComment,
    deleteComment,
} from "@/services/coments";
import { toastMessage } from "@/lib/common/toastMessage";

interface CreateCommentParams {
    projectId: number;
    logId: number;
    commentInput: string;
}

interface DeleteCommentParams {
    projectId: number;
    logId: number;
    commentId: number;
}

export const useComments = (projectId: number, logId?: number) => {
    return useQuery({
        queryKey: queryKeys.comments(projectId, logId!),
        queryFn: () => getCommentList(projectId, logId!),
        enabled: !!logId,
    });
};

export const useCommentMutation = () => {
    const queryClient = useQueryClient();

    const invalidate = (projectId: number) =>
        queryClient.invalidateQueries({ queryKey: queryKeys.logs(projectId) });

    const createMutation = useMutation({
        mutationFn: ({ projectId, logId, commentInput }: CreateCommentParams) =>
            createComment(projectId, logId, commentInput),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            toastMessage.successDoc("comment", "create");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: ({ projectId, logId, commentId }: DeleteCommentParams) =>
            deleteComment(projectId, logId, commentId),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            toastMessage.successDoc("comment", "delete");
        },
    });

    return {
        createComment: createMutation.mutate,
        deleteComment: deleteMutation.mutate,

        isCommentPending: createMutation.isPending || deleteMutation.isPending,
    };
};
