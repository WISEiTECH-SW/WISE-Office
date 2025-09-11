import { useState } from "react";
import type { Comment } from "@/types/comment";
import {
    getCommentList,
    createComment,
    deleteComment,
} from "@/services/coments";

export function useComments(projectId: number) {
    const [commentList, setCommentList] = useState<Comment[]>([]);

    const loadCommentList = async (logId: number) => {
        const commentList = await getCommentList(projectId, logId);
        setCommentList(commentList);
    };

    const addComment = async (logId: number, commentInput: string) => {
        const newComment = await createComment(projectId, logId, commentInput);
        setCommentList((prev) => [newComment, ...prev]);
    };

    const removeComment = async (logId: number, commentId: number) => {
        await deleteComment(projectId, logId, commentId);
        setCommentList((prev) =>
            prev.filter((comment) => comment.id !== commentId)
        );
    };

    return { commentList, loadCommentList, addComment, removeComment };
}
