import { create } from "zustand";
import { MINUTES } from "@/lib/data/overview";

type ApprovalState = {
    optionIndex: number;
    year: number;
    projectId: number;

    setOptionIndex: (optionIndex: number) => void;
    setYear: (year: number) => void;
    setProjectId: (projectId: number) => void;
};

export const useApproval = create<ApprovalState>((set) => ({
    optionIndex: 0,
    year: Math.max(...MINUTES.map((m) => m.minutes_date.getFullYear())),
    projectId: Math.min(...MINUTES.map((m) => m.project_pk)),

    setOptionIndex: (optionIndex) => set({ optionIndex }),
    setYear: (year) => set({ year }),
    setProjectId: (projectId) => set({ projectId }),
}));
