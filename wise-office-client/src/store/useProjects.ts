import { create } from "zustand";
import type { Project, PageParams } from "@/types/project";
import { getCurrentPageProjects } from "@/services/projects";

type ProjectsState = {
    projects: Project[];
    addProject: (project: Project) => void;
    fetchProjects: (params: PageParams) => Promise<void>;
};

export const useProjects = create<ProjectsState>()((set, get) => ({
    projects: [],
    addProject: (project) =>
        set((state) => ({ projects: [project, ...state.projects] })),
    fetchProjects: async (params) => {
        const data = await getCurrentPageProjects(params);
        set({
            projects: Array.isArray(data.projectListResponses)
                ? data.projectListResponses
                : [],
        });
    },
}));
