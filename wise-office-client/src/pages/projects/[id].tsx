import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useLogs } from "@/hooks/domain/useLogs";

import type { ProjectInfo } from "@/types/project";
import { getProjectById } from "@/services/projects";
import ProjectUpdateModal from "@/components/project/project_modal_update";
import type { Log, LogInput } from "@/types/log";
import { getLogList } from "@/services/logs";

import {
    ProjectInfoContainer,
    ProjectLogList,
    ProjectLogWriteButton,
    ProjectLog,
    ProjectAttendantList,
    ProjectLogInput,
} from "@/components/project";
import ConfirmModal from "@/components/ConfirmModal";
import { useComments } from "@/hooks/domain/useComments";

export default function ProjectPageById() {
    const router = useRouter();
    const { id } = router.query;
    const projectId = Number(id);

    // hooks
    const { selectedLog, selectLog, addLog, updateLog, removeLog } =
        useLogs(projectId);
    const { commentList, loadCommentList, addComment, removeComment } =
        useComments(projectId);

    // Project
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Log
    const [logList, setLogList] = useState<Log[]>([]);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<LogInput | null>(null);

    // Modal Handler
    const handleCloseModal = () => {
        setIsLogModalOpen(false);
        setEditingLog(null);
    };

    const handleModifyModal = (logInput: LogInput) => {
        setEditingLog(logInput);
        setIsLogModalOpen(true);
    };

    // Log Handler
    const handleSelectLog = async (logId: number) => {
        await selectLog(logId);
        await loadCommentList(logId);
    };

    const handleCreateLog = async (logInput: LogInput) => {
        const newLog = await addLog(logInput);
        setLogList((prev) => [newLog, ...prev]);
    };

    const handleDeleteLog = async (logId: number) => {
        setLogList((prev) => prev.filter((log) => log.logId !== logId));
        await removeLog(logId);
        getLogList(projectId).then(setLogList).catch(console.error);
    };

    const handleModifyLog = async (logInput: LogInput) => {
        const updatedLog = await updateLog(logInput);
        setLogList((prev) =>
            prev.map((log) =>
                log.logId === updatedLog?.logId
                    ? { ...log, ...updatedLog }
                    : log
            )
        );
    };

    // Comment Handler
    const updateCommentCount = (logId: number, isIncrease: boolean) => {
        setLogList((prev) =>
            prev.map((log) =>
                log.logId === logId
                    ? {
                          ...log,
                          commentCnt: log.commentCnt + (isIncrease ? 1 : -1),
                      }
                    : log
            )
        );
    };

    const handleCreateComment = async (commentInput: string) => {
        if (!selectedLog) return;

        await addComment(selectedLog.logId, commentInput);
        updateCommentCount(selectedLog.logId, true);
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!selectedLog) return;

        await removeComment(selectedLog.logId, commentId);
        updateCommentCount(selectedLog.logId, false);
    };

    // 처음 데이터 로드
    useEffect(() => {
        getProjectById(projectId).then(setProjectInfo).catch(console.error);
        getLogList(projectId).then(setLogList).catch(console.error);
    }, [router.isReady, id]);

    if (!projectInfo) return <div>!!No Project!!</div>;
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                {/* Project Information */}
                <ProjectInfoContainer
                    projectInfo={projectInfo}
                    onEdit={() => {
                        setIsEditOpen(true);
                    }}
                    onDelete={() => {
                        setIsConfirmOpen(true);
                    }}
                />
                {isEditOpen && projectInfo.projectId && (
                    <ProjectUpdateModal
                        projectId={projectInfo.projectId}
                        setProjectInfo={setProjectInfo}
                        onClose={() => setIsEditOpen(false)}
                    />
                )}
                {isConfirmOpen && projectInfo.projectId && (
                    <ConfirmModal
                        deleteTarget={"project"}
                        projectId={projectInfo.projectId}
                        onClose={() => setIsConfirmOpen(false)}
                    />
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* LOG List - Left */}
                    <div className="col-span-3">
                        <ProjectLogList
                            logList={logList}
                            selectedLog={selectedLog}
                            onSelectLog={handleSelectLog}
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
                            modifyModal={handleModifyModal}
                            commentList={commentList}
                            onSummit={handleCreateComment}
                            onDeleteComment={handleDeleteComment}
                        />
                    </div>
                    {/* Attendant List - Right */}
                    <div className="col-span-3">
                        <ProjectAttendantList
                            attendants={[
                                projectInfo.managerName,
                                ...projectInfo.attendant,
                            ]}
                        />
                    </div>
                </div>
            </div>
            <ProjectLogInput
                isOpen={isLogModalOpen}
                onClose={handleCloseModal}
                onSubmit={editingLog ? handleModifyLog : handleCreateLog}
                editingLog={editingLog}
            />
        </div>
    );
}
