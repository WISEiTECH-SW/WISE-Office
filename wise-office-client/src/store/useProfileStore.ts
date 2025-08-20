import { create } from "zustand";
import type { Profile } from "@/types/profile";

interface ProfileStore {
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
    reset: () => void;
}

const initialState = {
    profile: null as Profile | null,
};

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    reset: () => set(initialState),
}));
