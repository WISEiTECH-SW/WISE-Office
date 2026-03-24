import { SelectedDocument } from "@/types/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReturnTargetDocState {
    returnTargetDoc: SelectedDocument | null;
    setReturnTargetDoc: (doc: SelectedDocument) => void;
    clearReturnTargetDoc: () => void;
}

export const useReturnTargetDocStore = create<ReturnTargetDocState>()(
    persist(
        (set) => ({
            returnTargetDoc: null,
            setReturnTargetDoc: (doc) => set({ returnTargetDoc: doc }),
            clearReturnTargetDoc: () => set({ returnTargetDoc: null }),
        }),
        {
            name: "return-target-doc-storage",
        },
    ),
);
