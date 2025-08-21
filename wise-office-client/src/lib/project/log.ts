import React, { useState } from "react";
import { Log, LogDetail } from "@/types/log";

export const deleteLogList = (logs: Log[], logId: number): Log[] => {
    return logs.filter((log) => log.logId !== logId);
};

export const convertToLog = (logDetail: LogDetail): Log => {
    return {
        logId: logDetail.logId,
        title: logDetail.title,
        writer: logDetail.writer,
        createdAt: logDetail.createdAt,
        commentCnt: 0,
        canmodify: logDetail.canModify,
    };
};
