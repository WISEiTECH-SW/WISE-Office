import { api } from "@/lib/clientApi";
import {
    ApproveDetailResponse,
    ApproveList,
    MinutesInfo,
    MinutesList,
} from "@/types/document";

export async function getMinutes(projectId: number): Promise<MinutesList> {
    const { data } = await api.get(`/projects/${projectId}/minutes`);
    return data;
}

export async function getApproves(projectId: number): Promise<ApproveList> {
    const { data } = await api.get(`/projects/${projectId}/approves`);
    return data;
}

export async function getMinutesInfo(
    projectId: number,
    minutesId: number,
): Promise<MinutesInfo> {
    const { data } = await api.get(
        `/projects/${projectId}/minutes/${minutesId}`,
    );

    return data;
}

export async function getApproveInfo(
    projectId: number,
    approveId: number,
): Promise<ApproveDetailResponse> {
    const { data } = await api.get(
        `/projects/${projectId}/approves/${approveId}`,
    );

    return data;
}
