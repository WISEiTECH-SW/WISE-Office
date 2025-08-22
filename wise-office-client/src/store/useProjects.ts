import { create } from "zustand";
import type { Project } from "@/types/project";
import { getProjects as apiGetProjects } from "@/services/projects";

type ProjectsState = {
    projects: Project[];
    addProject: (project: Project) => void;
    fetchProjects: () => Promise<void>;
};

export const useProjects = create<ProjectsState>()((set) => ({
    projects: [],
    addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
    fetchProjects: async () => {
        const data = await apiGetProjects();
        set({ projects: Array.isArray(data) ? data : [] });
    },
}));
