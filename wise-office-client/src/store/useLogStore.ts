import { Log } from "@/types/log";
import { create } from "zustand";

type LogState = {
    selectedLogId: number;
    logList: Log[];
    setSelectedLogId: (logId: number) => void;
    setLogList: (logList: Log[]) => void;
};

export const useLogStore = create<LogState>((set) => ({
    selectedLogId: 0,
    logList: [],
    setSelectedLogId: (selectedLogId) => set({ selectedLogId }),
    setLogList: (logList) => set({ logList }),
}));
