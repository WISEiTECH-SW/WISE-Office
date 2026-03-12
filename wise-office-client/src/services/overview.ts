import { api } from "@/lib/clientApi";
import { MinutesInfo, MinutesList } from "@/types/document";

export async function getMinutes(projectId: number): Promise<MinutesList> {
    const { data } = await api.get(`/projects/${projectId}/minutes`);
    return data;
}

export async function getMinutesInfo(
    projectId: number,
    minutesId: number,
): Promise<MinutesInfo> {
    const { data } = await api.get(
        `/projects/${projectId}/minutes/${minutesId}`,
    );

    return data ?? [];
}
