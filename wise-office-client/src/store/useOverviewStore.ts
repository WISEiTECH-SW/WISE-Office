import { create } from "zustand";
import { MINUTES } from "@/lib/data/overview";

const today = new Date();

type ApprovalState = {
    optionIndex: number;
    year: number;
    month: number;
    projectId: number;

    setOptionIndex: (optionIndex: number) => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    setProjectId: (projectId: number) => void;
};

export const useOverview = create<ApprovalState>((set) => ({
    optionIndex: 0,
    year: Math.max(...MINUTES.map((m) => m.minutes_date.getFullYear())),
    month: today.getMonth(),
    projectId: Math.min(...MINUTES.map((m) => m.project_pk)),

    setOptionIndex: (optionIndex) => set({ optionIndex }),
    setYear: (year) => set({ year }),
    setMonth: (month) => set({ month }),
    setProjectId: (projectId) => set({ projectId }),
}));
