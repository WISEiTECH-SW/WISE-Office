import { create } from "zustand";
import type { Project } from "@/types/project";

type ProjectsState = {
    projects: Project[];
    addProject: (project: Project) => void;
    setProjects: (projects: Project[]) => void;
};

export const useProjects = create<ProjectsState>()((set) => ({
    projects: [],
    addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
    setProjects: (projects) => set({ projects }),
}));
