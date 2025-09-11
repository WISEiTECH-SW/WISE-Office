import { api } from "@/lib/clientApi";
import type { Comment } from "@/types/comment";

/**
 * 특정 ProjectId, LogId에 해당하는 comment 배열을 가져오는 함수
 * @param projectId 조회할 프로젝트의 ID
 * @param logId 조회할 로그의 ID
 * @returns Comment 배열 또는 undefined
 */
export async function getCommentList(
    projectId: number,
    logId: number
): Promise<Comment[]> {
    const res = await api.get<Comment[]>(
        `/v1/projects/${projectId}/logs/${logId}/comments`
    );
    return res.data;
}

/**
 * 특정 project에 로그를 생성하는 함수
 * @param projectId 프로젝트의 ID
 * @param logId 로그의 ID
 * @param commentInput 댓글 입력 내용
 * @returns 생성된 Comment
 */
export async function createComment(
    projectId: number,
    logId: number,
    commentInput: string
): Promise<Comment> {
    const res = await api.post<Comment>(
        `/v1/projects/${projectId}/logs/${logId}/comments`,
        { content: commentInput }
    );
    return res.data;
}

/**
 * 특정 project의 특정 log를 삭제하는 함수
 * @param projectId 프로젝트의 ID
 * @param logId 삭제할 로그 ID
 * @param commentId 삭제할 댓글 ID
 */
export async function deleteComment(
    projectId: number,
    logId: number,
    commentId: number
) {
    await api.delete(
        `/v1/projects/${projectId}/logs/${logId}/comments/${commentId}`
    );
}
