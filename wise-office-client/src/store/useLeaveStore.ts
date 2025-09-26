import { Row } from "@/types/annualLeave";
import { create } from "zustand";

type leave = {
    inputData: Row[];
    setInputData: (data: Row[]) => void;
};

export const useLeaveStore = create<leave>((set) => ({
    inputData: [],
    setInputData: (inputData) => set({ inputData }),
}));
