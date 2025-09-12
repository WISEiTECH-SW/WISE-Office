import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useLogs } from "@/hooks/domain/useLogs";

import type { ProjectInfo } from "@/types/project";
import { getProjectById } from "@/services/projects";
import type { Log, LogInput } from "@/types/log";
import { getLogList } from "@/services/logs";

import {
    ProjectInfoContainer,
    ProjectLogList,
    ProjectLogWriteButton,
    ProjectLog,
    ProjectAttendantList,
} from "@/components/project";
import { LogWriteModal, ProjectUpdateModal } from "@/components/modal";

import { useComments } from "@/hooks/domain/useComments";
import { useProjects } from "@/hooks/domain/useProjects";

import ConfirmModal from "@/components/modal/ConfirmModal";

export default function ProjectPageById() {
    const router = useRouter();
    const { id } = router.query;
    const projectId = Number(id);

    // hooks
    const { selectedLog, selectLog, addLog, updateLog, removeLog } =
        useLogs(projectId);
    const {
        commentList,
        setCommentList,
        loadCommentList,
        addComment,
        removeComment,
    } = useComments(projectId);
    const { removeProject } = useProjects(projectId);

    // Project
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Log
    const [logList, setLogList] = useState<Log[]>([]);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<LogInput | null>(null);

    // delete
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [delteTarget, setDeleteTarget] = useState<[string, number]>(["", 0]);

    // Modal Handler
    const handleCloseModal = () => {
        setIsLogModalOpen(false);
        setEditingLog(null);
    };

    const handleModifyModal = (logInput: LogInput) => {
        setEditingLog(logInput);
        setIsLogModalOpen(true);
    };

    const handleConfirmModal = (target: string, id: number) => {
        setDeleteTarget([target, id]);
        setIsConfirmOpen(true);
    };

    // Log Handler
    const handleSelectLog = async (logId: number) => {
        await selectLog(logId);
        await loadCommentList(logId);
    };

    const handleCreateLog = async (logInput: LogInput) => {
        const newLog = await addLog(logInput);
        setLogList((prev) => [newLog, ...prev]);
        setCommentList([]);
    };

    const handleDeleteLog = async (logId: number) => {
        setLogList((prev) => prev.filter((log) => log.logId !== logId));
        await removeLog(logId);
        setIsConfirmOpen(false);
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
        setIsConfirmOpen(false);
    };

    const deleteHandlers: Record<string, (id: number) => void> = {
        project: () => removeProject(),
        log: (id) => handleDeleteLog(id),
        comment: (id) => handleDeleteComment(id),
    };

    // 처음 데이터 로드
    useEffect(() => {
        getProjectById(projectId).then(setProjectInfo).catch(console.error);
        getLogList(projectId).then(setLogList).catch(console.error);
    }, [router.isReady, id]);

    if (!projectInfo) return <div>!!No Project!!</div>;
    return (
        <div className="min-h-screen min-w-[650px] bg-gray-50">
            <div className="px-6 pb-4">
                {/* Project Information */}
                <ProjectInfoContainer
                    projectInfo={projectInfo}
                    onEdit={() => {
                        setIsEditOpen(true);
                    }}
                    onDelete={() => handleConfirmModal("project", projectId)}
                />
                {isEditOpen && projectInfo.projectId && (
                    <ProjectUpdateModal
                        projectId={projectInfo.projectId}
                        setProjectInfo={setProjectInfo}
                        onClose={() => setIsEditOpen(false)}
                    />
                )}

                {isConfirmOpen && delteTarget[0] != "" && (
                    <ConfirmModal
                        deleteTarget={delteTarget}
                        onConfirm={deleteHandlers[delteTarget[0]]}
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
                            onDeleteLog={handleConfirmModal}
                        />
                        {projectInfo.attending && (
                            <div className="mt-2">
                                <ProjectLogWriteButton
                                    onClick={() => setIsLogModalOpen(true)}
                                />
                            </div>
                        )}
                    </div>
                    {/* LOG & Comment - Center */}
                    <div className="col-span-6">
                        <ProjectLog
                            selectedLog={selectedLog}
                            modifyModal={handleModifyModal}
                            commentList={commentList}
                            isAttending={projectInfo.attending}
                            onSummit={handleCreateComment}
                            onDeleteComment={handleConfirmModal}
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
            <LogWriteModal
                isOpen={isLogModalOpen}
                onClose={handleCloseModal}
                onSubmit={editingLog ? handleModifyLog : handleCreateLog}
                editingLog={editingLog}
            />
        </div>
    );
}
