import { create } from "zustand";
import { MINUTES } from "@/lib/data/overview";

type ApprovalState = {
    year: number;
    projectId: number;

    setYear: (year: number) => void;
    setProjectId: (projectId: number) => void;
};

export const useApproval = create<ApprovalState>((set) => ({
    year: Math.max(...MINUTES.map((m) => m.minutes_date.getFullYear())),
    projectId: Math.min(...MINUTES.map((m) => m.project_pk)),

    setYear: (year) => set({ year }),
    setProjectId: (projectId) => set({ projectId }),
}));
