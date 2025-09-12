import { getCurrentPageProjects } from "@/services/projects";
import type { PageParams, Project } from "@/types/project";
import { create } from "zustand";

type ProjectsState = {
    totalCount: number;
    totalPages: number;
    projects: Project[];
    addProject: (project: Project) => void;
    fetchProjects: (params: PageParams) => Promise<void>;
};

export const useProjects = create<ProjectsState>()((set) => ({
    totalCount: 0,
    totalPages: 0,
    projects: [],
    addProject: (project) =>
        set((state) => ({ projects: [project, ...state.projects] })),
    fetchProjects: async (params) => {
        const data = await getCurrentPageProjects(params);
        set({
            projects: Array.isArray(data.projectListResponses)
                ? data.projectListResponses
                : [],
            totalCount: data.pageNationInfo.totalCount ?? 0,
            totalPages: data.pageNationInfo.totalPages ?? 0,
        });
    },
}));
