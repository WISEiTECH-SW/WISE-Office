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
    return await api
        .get<ProjectInfo>(`/v2/projects/${projectId}`)
        .then((res) => res.data);
}

/**
 * 새로운 project를 생성하는 함수
 * @param CreateProject 작성한 프로젝트 정보
 * @returns ProjectInfo 객체 또는 undefined
 */
export async function postProject(data: CreateProject) {
    return await api.post("/v2/projects", data).then((res) => res.data);
}

/**
 * 특정 projectId에 해당하는 프로젝트 정보를 수정하는 함수
 * @param projectId 조회할 프로젝트의 ID
 * @param CreateProject 수정한 프로젝트 정보
 * @returns ProjectInfo 객체 또는 undefined
 */
export async function updateProject(data: CreateProject, projectId: number) {
    return await api
        .patch(`/v2/projects/${projectId}`, data)
        .then((res) => res.data);
}

/**
 * 특정 projectId에 해당하는 프로젝트 정보를 삭제하는 함수
 * @param projectId 삭제할 프로젝트의 ID
 * @returns ProjectInfo 객체 또는 undefined
 */
export async function deleteProjectApi(projectId: number) {
    return await api
        .delete(`/v2/projects/${projectId}`)
        .then((res) => res.data);
}
