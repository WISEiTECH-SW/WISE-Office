import { api } from "@/lib/clientApi";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
    const { data } = await api.get<Project[]>("/projects");
    return data;
}
