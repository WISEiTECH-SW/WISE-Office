import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "@/services/coments";
import {
    toastMessage,
    getDocumentToastMessage,
} from "@/lib/common/toastMessage";

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

export const useCommentMutation = () => {
    const queryClient = useQueryClient();

    const invalidate = (projectId: number, logId: number) => {
        queryClient.invalidateQueries({ queryKey: ["logs", projectId] });
        queryClient.invalidateQueries({ queryKey: ["comments", logId] });
    };

    //CREATE
    const createMutation = useMutation({
        mutationFn: ({ projectId, logId, commentInput }: CreateCommentParams) =>
            createComment(projectId, logId, commentInput),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId, variables.logId);
            toastMessage.success(getDocumentToastMessage("comment", "create"));
        },
        onError: () => {
            toastMessage.error("댓글 작성에 실패 했습니다.");
        },
    });

    //DELETE
    const deleteMutation = useMutation({
        mutationFn: ({ projectId, logId, commentId }: DeleteCommentParams) =>
            deleteComment(projectId, logId, commentId),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId, variables.logId);
            toastMessage.success(getDocumentToastMessage("comment", "delete"));
        },
    });

    return {
        createComment: createMutation.mutate,
        deleteComment: deleteMutation.mutate,
        isCommentLoading: createMutation.isPending || deleteMutation.isPending,
    };
};
