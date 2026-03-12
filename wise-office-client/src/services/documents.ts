import { api } from "@/lib/clientApi";
import {
    ApproveCreateResonse,
    ApproveDetailResponse,
    ApproveUpdateRequest,
    ApproveUpdateResponse,
} from "@/types/document";

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

/**
 * approve를 조회하는 함수
 * @param projectId 해당 프로젝트의 ID, approveId 조회하고자 하는 품의서의 ID
 * @returns ApproveDetailResponse 객체
 */
export async function getApproveDetail(
    projectId: number,
    approveId: number,
): Promise<ApproveDetailResponse> {
    const res = await api.get(`projects/${projectId}/approves/${approveId}`);

    return res.data;
}

/**
 * approve를 수정하는 함수
 * @param projectId 해당 프로젝트의 ID, approveId 조회하고자 하는 품의서의 ID
 * @returns ApproveDetailResponse 객체
 */
export async function updateApprove(
    projectId: number,
    approveId: number,
    request: ApproveUpdateRequest,
): Promise<ApproveUpdateResponse> {
    const res = await api.patch(`projects/${projectId}/approves/${approveId}`, {
        request: request,
    });
    return res.data;
}

/**
 * approve 리스트를 조회하는 함수
 * @param projectId 해당 프로젝트의 ID
 * @returns ApproveListResopnse 객체
 */
export async function getApproveList(projectId: number) {
    const res = await api.get(`projects/${projectId}/approves`);
    return res.data;
}
