import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import type { ProjectInfo } from "@/types/project";
import { editProjectInfo, deleteProject } from "@/lib/project/info";
import { getProjectById } from "@/services/projects";

import type { Log, LogDetail, LogInput } from "@/types/log";
import {
    getLogList,
    getLogDetail,
    createLog,
    deleteLog,
    patchLog,
} from "@/services/logs";
import { convertToLog, deleteLogList } from "@/lib/project/log";

import {
    ProjectInfoContainer,
    ProjectLogList,
    ProjectLogWriteButton,
    ProjectLog,
    ProjectAttendantList,
    ProjectLogInput,
} from "@/components/project";

export default function projectPageById() {
    const router = useRouter();
    const { id } = router.query;

    // Project
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);

    // Log
    const [logList, setLogList] = useState<Log[]>([]);
    const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
    const [selectedLog, setSelectedLog] = useState<LogDetail | null>(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<LogDetail | null>(null);

    // 로그 선택
    const selectLog = (logId: number) => {
        setSelectedLogId(logId);
    };

    //모달창 종료
    const handleCloseModal = () => {
        setIsLogModalOpen(false);
        setEditingLog(null);
    };

    // 로그 생성
    const handleLogSubmit = async (logInput: LogInput) => {
        if (typeof id !== "string") return;
        const projectId = Number(id);
        if (isNaN(projectId)) return;

        // 로그 수정
        if (editingLog) {
            const updateLog = await patchLog(
                projectId,
                editingLog.logId,
                logInput
            );
            const updateLogList = logList.map((log) =>
                log.logId === editingLog.logId
                    ? {
                          ...log,
                          ...convertToLog(updateLog),
                      }
                    : log
            );
            setLogList(updateLogList);
            // selectLog(updateLog.logId);
            setSelectedLog(updateLog);
            setEditingLog(null);
        } else {
            // 로그 생성
            const newLogDetail = createLog(projectId, logInput);
            const newLog = convertToLog(await newLogDetail);

            setLogList((prev) => [newLog, ...prev]);
            selectLog(newLog.logId);
        }
    };

    // 로그 수정 클릭시 모달창을 기존 내용을 담아서 띄우는 함수
    const handleEditLog = (log: LogDetail) => {
        setEditingLog(log);
        setIsLogModalOpen(true);
    };

    // 로그 삭제
    const handleDeleteLog = (logId: number) => {
        if (window.confirm("이 로그를 삭제하시겠습니까?")) {
            if (!router.isReady) return;
            if (typeof id !== "string") return;
            const projectId = Number(id);
            if (isNaN(projectId)) return;

            deleteLog(projectId, logId);

            setLogList(deleteLogList(logList, logId));
            setSelectedLog(null);
        }
    };

    // 처음 데이터 로드
    useEffect(() => {
        if (!router.isReady) return;
        if (typeof id !== "string") return;
        const projectId = Number(id);
        if (isNaN(projectId)) return;

        getProjectById(projectId).then(setProjectInfo).catch(console.error);
        getLogList(projectId).then(setLogList).catch(console.error);
        // comment list
    }, [router.isReady, id]);

    // 로그 선택시
    useEffect(() => {
        if (!router.isReady || !selectedLogId) return;
        if (typeof id !== "string") return;
        const projectId = Number(id);
        if (isNaN(projectId)) return;

        getLogDetail(projectId, selectedLogId)
            .then(setSelectedLog)
            .catch(console.error);
    }, [router.isReady, id, selectedLogId]);

    if (!projectInfo) return <div>!!No Project!!</div>;
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                {/* Project Information */}
                <ProjectInfoContainer
                    projectInfo={projectInfo}
                    onEdit={editProjectInfo}
                    onDelete={deleteProject}
                />
                <div className="grid grid-cols-12 gap-6">
                    {/* LOG List - Left */}
                    <div className="col-span-3">
                        <ProjectLogList
                            logList={logList}
                            selectedLog={selectedLog}
                            onSelectLog={selectLog}
                            onDeleteLog={handleDeleteLog}
                        />
                        <div className="mt-2">
                            <ProjectLogWriteButton
                                onClick={() => setIsLogModalOpen(true)}
                            />
                        </div>
                    </div>
                    {/* LOG & Comment - Center */}
                    <div className="col-span-6">
                        <ProjectLog
                            selectedLog={selectedLog}
                            // newComment={newComment}
                            // onCommentChange={(e) =>
                            //     setNewComment(e.target.value)
                            // }
                            // onAddComment={handleAddComment}
                            // onDeleteComment={handleDeleteComment}
                            handleEditLog={handleEditLog}
                        />
                    </div>
                    {/* Attendant List - Right */}
                    <div className="col-span-3">
                        <ProjectAttendantList
                            attendants={projectInfo.attendant}
                        />
                    </div>
                </div>
            </div>
            <ProjectLogInput
                isOpen={isLogModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleLogSubmit}
                editingLog={editingLog}
            />
        </div>
    );
}
