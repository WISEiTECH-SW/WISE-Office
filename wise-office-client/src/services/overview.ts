import { api } from "@/lib/clientApi";
import {
    ApprovalDetailResponse,
    ApproveList,
    MinutesInfo,
    MinutesList,
    MonthlyDocument,
} from "@/types/document";

export async function getMinutes(projectId: number): Promise<MinutesList> {
    const { data } = await api.get(`/projects/${projectId}/minutes`);
    return data;
}

export async function getMinutesAll(projectId: number): Promise<MinutesList> {
    const { data } = await api.get(`/projects/${projectId}/minutes/all`);
    return data;
}

export async function getApproves(projectId: number): Promise<ApproveList> {
    const { data } = await api.get(`/projects/${projectId}/approves`);
    return data;
}

export async function getApprovesAll(projectId: number): Promise<ApproveList> {
    const { data } = await api.get(`/projects/${projectId}/approves/all`);
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
): Promise<ApprovalDetailResponse> {
    const { data } = await api.get(
        `/projects/${projectId}/approves/${approveId}`,
    );

    return data;
}

export async function getMonthlyDocuments(
    year: number,
    month: number,
): Promise<MonthlyDocument[]> {
    const { data } = await api.get(`/projects/documents`, {
        params: { year, month },
    });

    return data;
}
