import { api } from "@/lib/clientApi";
import type { Project, ProjectInfo, CreateProject } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
    const { data } = await api.get<Project[]>("v2/projects");
    return data;
}

/**
 * 특정 projectId에 해당하는 프로젝트 정보를 가져오는 함수
 * @param projectId 조회할 프로젝트의 ID
 * @returns ProjectInfo 객체 또는 undefined
 */
export async function getProjectById(projectId: number): Promise<ProjectInfo> {
    const res = await api.get<ProjectInfo>(`/v2/projects/${projectId}`);
    return res.data;
}

export async function postProject(data: CreateProject) {
    return await api.post("/v2/projects", data).then((res) => res.data);
}

export async function updateProject(data: CreateProject, projectId: number) {
    const res = await api.patch(`/v2/projects/${projectId}`, data);
    return res.data;
}

export async function deleteProjectApi(projectId: number) {
    return await api.delete(`/v2/projects/${projectId}`).then((res) => res.data);
}