import React, { useState } from "react";
import { Log } from "@/components/project/types";

/**
 * 새로운 로그를 생성하여 반환하는 함수
 * @param title 로그 제목
 * @param content 로그 내용
 * @param user 작성자
 * @returns 생성된 Log 객체
 */
export const createLog = (
    title: string,
    content: string,
    user: string
): Log => {
    return {
        id: Date.now(), // 실제로는 백엔드에서 고유 ID를 부여해야 합니다.
        title,
        user,
        content,
        date: new Date().toLocaleString(),
        comments: [],
    };
};

/**
 * 특정 ID의 로그를 삭제하는 함수
 * @param logs 현재 로그 배열
 * @param logId 삭제할 로그의 ID
 * @returns 삭제된 로그가 제외된 새로운 로그 배열
 */
export const deleteLog = (logs: Log[], logId: number): Log[] => {
    return logs.filter((log) => log.id !== logId);
};
