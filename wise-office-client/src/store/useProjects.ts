import { getCurrentPageProjects } from "@/services/projects";
import type { PageParams, Project } from "@/types/project";
import { create } from "zustand";

type ProjectsState = {
    projects: Project[];
    addProject: (project: Project) => void;
    fetchProjects: (params: PageParams) => Promise<void>;
};

export const useProjects = create<ProjectsState>()((set) => ({
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
