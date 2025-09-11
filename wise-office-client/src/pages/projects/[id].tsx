import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import type { ProjectInfo } from "@/types/project";
import { getProjectById } from "@/services/projects";
import ProjectUpdateModal from "@/components/project/project_modal_update";
import type { Log, LogDetail, LogInput } from "@/types/log";
import {
    getLogList,
    getLogDetail,
    createLog,
    deleteLog,
    patchLog,
} from "@/services/logs";
import { convertToLog, deleteLogList } from "@/lib/project/log";
import { useLogStore } from "@/store/useLogStore";

import { Comment, CommentInput } from "@/types/comment";
import {
    getCommentList,
    createComment,
    deleteComment,
} from "@/services/coments";

import {
    ProjectInfoContainer,
    ProjectLogList,
    ProjectLogWriteButton,
    ProjectLog,
    ProjectAttendantList,
    ProjectLogInput,
} from "@/components/project";
import ConfirmModal from "@/components/ConfirmModal";

export default function ProjectPageById() {
    const router = useRouter();
    const { id } = router.query;
    const projectId = Number(id);

    // Project
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Log
    const [, setIsLoading] = useState(true);
    const [logList, setLogList] = useState<Log[]>([]);
    // const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
    const [selectedLog, setSelectedLog] = useState<LogDetail | null>(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<LogDetail | null>(null);
    const { selectedLogId, setSelectedLogId } = useLogStore();

    // Comment
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

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

    const fetchLogComment = useCallback(async () => {
        if (!router.isReady || !selectedLogId) return;
        if (typeof id !== "string") return;
        const projectId = Number(id);
        if (isNaN(projectId)) return;

        try {
            setIsLoading(true);
            const logDetail = await getLogDetail(projectId, selectedLogId);
            const comments = await getCommentList(projectId, logDetail.logId);
            const updatedLogList = await getLogList(projectId);

            setSelectedLog(logDetail);
            setCommentList(comments);
            setLogList(updatedLogList);
        } catch (err) {
            console.error("데이터를 불러오는 데 실패했습니다:", err);
        } finally {
            setIsLoading(false);
        }
    }, [router.isReady, id, selectedLogId]);

    // 댓글 생성
    const handleAddComment = async () => {
        if (!selectedLog || newComment.trim() === "") {
            return;
        }
        const projectId = Number(id);
        if (isNaN(projectId)) return;

        const commentInput: CommentInput = { content: newComment };
        await createComment(projectId, selectedLog.logId, commentInput);

        fetchLogComment();
        setNewComment("");
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId: number) => {
        if (!selectedLog) return;
        if (typeof id !== "string") return;
        const projectId = Number(id);
        if (isNaN(projectId)) return;

        try {
            await deleteComment(projectId, selectedLog.logId, commentId);
        } catch (err) {
            console.error(err);
        }
        fetchLogComment();
        setNewComment("");
    };

    // 처음 데이터 로드
    useEffect(() => {
        if (!router.isReady) return;
        if (typeof id !== "string") return;
        const projectId = Number(id);
        if (isNaN(projectId)) return;

        getProjectById(projectId).then(setProjectInfo).catch(console.error);
        getLogList(projectId).then(setLogList).catch(console.error);
    }, [router.isReady, id]);

    // 로그 선택시
    useEffect(() => {
        fetchLogComment();
        setNewComment("");
    }, [fetchLogComment]);

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
                            handleEditLog={handleEditLog}
                            commentList={commentList}
                            newComment={newComment}
                            onCommentChange={(e) =>
                                setNewComment(e.target.value)
                            }
                            onAddComment={handleAddComment}
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
                onSubmit={handleLogSubmit}
                editingLog={editingLog}
            />
        </div>
    );
}
