import { create } from "zustand";
import type { Profile } from "@/types/profile";

interface ProfileStore {
    profile: Profile | null;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
}));
