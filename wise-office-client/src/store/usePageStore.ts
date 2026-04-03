import { create } from "zustand";

interface PageStoreState {
    currentPage: number;
    setProjectPage: (page: number) => void;
}

export const usePageStore = create<PageStoreState>((set) => ({
    currentPage: 1,
    setProjectPage: (page) => set({ currentPage: page }),
}));
