import { useState } from "react";
import type { LogDetail, LogInput } from "@/types/log";
import { getLogDetail, createLog, deleteLog, patchLog } from "@/services/logs";
import { convertToLog } from "@/lib/project/log";

export function useLogs(projectId: number) {
    const [selectedLog, setSelectedLog] = useState<LogDetail | null>(null);

    const selectLog = async (logId: number) => {
        const log = await getLogDetail(projectId, logId);
        setSelectedLog(log);
    };

    const addLog = async (logInput: LogInput) => {
        const newLog = await createLog(projectId, logInput);
        setSelectedLog(newLog);
        return convertToLog(newLog);
        // logList에 새 로그 추가 필요
    };

    const removeLog = async (logId: number) => {
        await deleteLog(projectId, logId);
        setSelectedLog(null);
    };

    const updateLog = async (logInput: LogInput) => {
        if (!selectedLog) return;

        const updatedLog = await patchLog(
            projectId,
            selectedLog.logId,
            logInput
        );
        setSelectedLog(updatedLog);
        return updatedLog;
    };

    return { selectedLog, selectLog, addLog, updateLog, removeLog };
}
