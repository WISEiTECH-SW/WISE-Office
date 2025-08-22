import { api } from "@/lib/clientApi";
import type { Log, LogDetail, LogInput } from "@/types/log";

/**
 * 특정 projectId에 해당하는 로그의 간략한 정보 배열을 가져오는 함수
 * @param projectId 조회할 프로젝트의 ID
 * @returns Log 배열 또는 undefined
 */
export async function getLogList(projectId: number): Promise<Log[]> {
    const res = await api.get<Log[]>(`/v1/${projectId}/logs`);
    return res.data;
}

/**
 * 특정 projectId와 logId에 해당하는 로그의 상세 정보를 가져오는 함수
 * @param projectId 조회할 프로젝트의 ID
 * @param logId 조회할 로그의 ID
 * @returns LogDetail 객체
 */
export async function getLogDetail(
    projectId: number,
    logId: number
): Promise<LogDetail> {
    const res = await api.get<LogDetail>(`/v1/${projectId}/logs/${logId}`);
    return res.data;
}

/**
 * 특정 project에 로그를 생성하는 함수
 * @param projectId 프로젝트의 ID
 * @param logInput 로그 입력 내용
 * @returns 생성된 LogDetail
 */
export async function createLog(
    projectId: number,
    logInput: LogInput
): Promise<LogDetail> {
    const res = await api.post<LogDetail>(`/v1/${projectId}/logs`, logInput);
    return res.data;
}

/**
 * 특정 project의 특정 log를 삭제하는 함수
 * @param projectId 프로젝트의 ID
 * @param logId 삭제할 로그 ID
 */
export async function deleteLog(projectId: number, logId: number) {
    await api.delete(`v1/${projectId}/logs/${logId}`);
}

/**
 * 특정 project의 특정 log를 수정하는 함수
 * @param projectId 프로젝트의 ID
 * @param logInput 수정할 로그 ID
 * @param logInput 수정할 내용
 * @return 수정된 LogDetail
 */
export async function patchLog(
    projectId: number,
    logId: number,
    logInput: LogInput
): Promise<LogDetail> {
    const res = await api.patch(`/v1/${projectId}/logs/${logId}`, logInput);
    return res.data;
}
