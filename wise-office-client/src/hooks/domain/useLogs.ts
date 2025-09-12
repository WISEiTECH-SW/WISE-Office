import { useState } from "react";
import type { LogDetail, LogInput } from "@/types/log";
import { getLogDetail, createLog, deleteLog, patchLog } from "@/services/logs";
import { convertToLog } from "@/lib/project/log";
import { toastMessage } from "@/lib/common/toastMessage";

export function useLogs(projectId: number) {
    const [selectedLog, setSelectedLog] = useState<LogDetail | null>(null);

    const selectLog = async (logId: number) => {
        const log = await getLogDetail(projectId, logId);
        setSelectedLog(log);
    };

    const addLog = async (logInput: LogInput) => {
        const newLog = await createLog(projectId, logInput);
        toastMessage.success("로그가 작성되었습니다.");
        setSelectedLog(newLog);
        return convertToLog(newLog);
    };

    const removeLog = async (logId: number) => {
        await deleteLog(projectId, logId);
        toastMessage.success("로그가 삭제되었습니다.");
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
        toastMessage.success("로그가 수정되었습니다.");
        return updatedLog;
    };

    return { selectedLog, selectLog, addLog, updateLog, removeLog };
}
