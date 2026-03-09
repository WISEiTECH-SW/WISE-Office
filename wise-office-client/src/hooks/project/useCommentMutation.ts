import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "@/services/coments";

export const useCommentMutation = (projectId: number, logId: number) => {
    const queryClient = useQueryClient();

    //CREATE
    const addComment = useMutation({
        mutationFn: (commentInput: string) =>
            createComment(projectId, logId, commentInput),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", logId] });
            queryClient.invalidateQueries({
                queryKey: ["logs", projectId],
            });
        },
    });

    //DELETE
    const removeComment = useMutation({
        mutationFn: (commentId: number) =>
            deleteComment(projectId, logId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", logId] });
            queryClient.invalidateQueries({
                queryKey: ["logs", projectId],
            });
        },
    });

    return {
        addComment: addComment.mutate,
        removeComment: removeComment.mutate,
        isCommentLoading: addComment.isPending || removeComment.isPending,
    };
};
