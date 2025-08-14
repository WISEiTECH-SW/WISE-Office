import { Log, Comment } from "@/components/project/types";

/**
 * 특정 로그에 새로운 댓글을 추가하는 함수
 * @param logs 현재 전체 로그 배열
 * @param logId 댓글을 추가할 로그의 ID
 * @param newCommentContent 새로운 댓글 내용
 * @param user 작성자 이름 (임시)
 * @returns 댓글이 추가된 새로운 로그 배열
 */
export const createCommentToLog = (
    logs: Log[],
    logId: number,
    newCommentContent: string,
    user: string
): Log[] => {
    // 로그 ID를 찾아 해당 로그의 댓글 배열에 새 댓글을 추가
    return logs.map((log) => {
        if (log.id === logId) {
            const newComment: Comment = {
                id: Date.now(),
                user,
                content: newCommentContent,
                date: new Date().toLocaleString(),
            };
            return {
                ...log,
                comments: [...log.comments, newComment],
            };
        }
        return log;
    });
};

/**
 * 특정 로그의 특정 댓글을 삭제하는 함수
 * @param logs 현재 전체 로그 배열
 * @param logId 댓글이 속한 로그의 ID
 * @param commentId 삭제할 댓글의 ID
 * @returns 댓글이 삭제된 새로운 로그 배열
 */
export const deleteCommentFromLog = (
    logs: Log[],
    logId: number,
    commentId: number
): Log[] => {
    // 로그 ID를 찾아 해당 로그의 댓글 배열에서 특정 댓글을 삭제
    return logs.map((log) => {
        if (log.id === logId) {
            return {
                ...log,
                comments: log.comments.filter(
                    (comment) => comment.id !== commentId
                ),
            };
        }
        return log;
    });
};
