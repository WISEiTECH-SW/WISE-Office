import { create } from "zustand";

type AuthStore = {
    hasToken: boolean;
    setHasToken: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    hasToken: false,
    setHasToken: (value) => set({ hasToken: value }),
}));
