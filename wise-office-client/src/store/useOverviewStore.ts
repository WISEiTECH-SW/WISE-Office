import { create } from "zustand";
import { MINUTES } from "@/lib/data/overview";

const today = new Date();

type OverviewState = {
    optionIndex: number;
    year: number;
    month: number;
    projectId: number;

    setOptionIndex: (optionIndex: number) => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    setProjectId: (projectId: number) => void;
};

export const useOverview = create<OverviewState>((set) => ({
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

// 미리보기 모달 상태
type PreviewState = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;

    onOpen: () => void;
    onClose: () => void;
};

export const usePreview = create<PreviewState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),

    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
