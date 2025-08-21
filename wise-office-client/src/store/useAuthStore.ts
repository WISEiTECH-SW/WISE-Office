import { create } from "zustand";

type AuthStore = {
    authCheck: boolean;
    hasToken: boolean;
    setHasToken: (value: boolean) => void;
    setAuthCheck: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    authCheck: false,
    hasToken: false,
    setHasToken: (value) => set({ hasToken: value }),
    setAuthCheck: (value) => set({ authCheck: value }),
}));
