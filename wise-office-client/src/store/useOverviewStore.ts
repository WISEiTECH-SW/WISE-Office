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
    year:
        MINUTES.length > 0
            ? Math.max(...MINUTES.map((m) => m.minutes_date.getFullYear()))
            : today.getFullYear(),
    month: today.getMonth(),
    projectId:
        MINUTES.length > 0 ? Math.min(...MINUTES.map((m) => m.project_pk)) : 0,

    setOptionIndex: (optionIndex) => set({ optionIndex }),
    setYear: (year) => set({ year }),
    setMonth: (month) => set({ month }),
    setProjectId: (projectId) => set({ projectId }),
}));
