import { create } from "zustand";
import type { Project } from "@/types/project";

type ProjectsState = {
    projects: Project[];
};

export const useProjects = create<ProjectsState>(() => ({
    projects: [],
}));
