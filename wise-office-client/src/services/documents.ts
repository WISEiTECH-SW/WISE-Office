import { api } from "@/lib/clientApi";
import { ApproveCreateResonse } from "@/types/document";

/**
 * 새로운 approve를 생성하는 함수
 * @param projectId 해당 프로젝트의 ID, minutesId 연관된 회의록의 ID
 * @returns ApproveCreateResponse 객체
 */
export async function createApprove(projectId: number, minutesId: number) {
    const res = await api.post<ApproveCreateResonse>(
        `projects/${projectId}/minutes/${minutesId}/approves`,
    );

    return res.data;
}
