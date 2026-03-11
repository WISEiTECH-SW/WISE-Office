import { api } from "@/lib/clientApi";
import {
    Minutes,
    MinutesCreateRequest,
    MinutesDetail,
    MinutesListResponse,
} from "@/types/document";

/**
 * 특정 project에 회의록 생성 함수
 * @param projectId 프로젝트 ID
 * @param minutesCreateRequest 회의록 입력 내용
 * @returns 생성된 Minute
 */
export async function createMinute(
    projectId: number,
    minutesCreateRequest: MinutesCreateRequest,
): Promise<Minutes[]> {
    const res = await api.post(
        `/projects/${projectId}/minutes`,
        minutesCreateRequest,
    );

    return res.data;
}

/**
 * 특정 project의 회의록 목록 조회 함수
 * @param projectId 프로젝트 ID
 * @returns Minutes[]
 */
export async function getMinuteList(
    projectId: number,
): Promise<MinutesListResponse[]> {
    const res = await api.get(`/projects/${projectId}/minutes`);

    return res.data;
}

/**
 * 특정 project의 특정 회의록 상세 조회 함수
 * @param projectId 프로젝트 ID
 * @param minutesId 회의록 ID
 * @returns Minutes[]
 */
export async function getMinute(
    projectId: number,
    minutesId: number,
): Promise<MinutesDetail> {
    const res = await api.get(`/projects/${projectId}/minutes/${minutesId}`);

    return res.data;
}
