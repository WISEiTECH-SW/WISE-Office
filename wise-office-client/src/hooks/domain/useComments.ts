import { useState } from "react";
import type { Comment } from "@/types/comment";
import {
    getCommentList,
    createComment,
    deleteComment,
} from "@/services/coments";
import { toastMessage } from "@/lib/common/toastMessage";

export function useComments(projectId: number) {
    const [commentList, setCommentList] = useState<Comment[]>([]);

    const loadCommentList = async (logId: number) => {
        const commentList = await getCommentList(projectId, logId);
        setCommentList(commentList);
    };

    const addComment = async (logId: number, commentInput: string) => {
        const newComment = await createComment(projectId, logId, commentInput);
        toastMessage.success("댓글이 작성되었습니다.");
        setCommentList((prev) => [newComment, ...prev]);
    };

    const removeComment = async (logId: number, commentId: number) => {
        await deleteComment(projectId, logId, commentId);
        setCommentList((prev) =>
            prev.filter((comment) => comment.id !== commentId)
        );
        toastMessage.success("댓글이 삭제되었습니다.");
    };

    return {
        commentList,
        setCommentList,
        loadCommentList,
        addComment,
        removeComment,
    };
}
