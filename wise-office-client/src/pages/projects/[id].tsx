import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useLogs } from "@/hooks/domain/useLogs";

import type { ProjectInfo } from "@/types/project";
import { getProjectById } from "@/services/projects";
import ProjectUpdateModal from "@/components/project/project_modal_update";
import type { Log, LogDetail, LogInput } from "@/types/log";
import {
    getLogList,
    // getLogDetail,
    // createLog,
    // deleteLog,
    // patchLog,
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
import { toastMessage } from "@/lib/common/toastMessage";
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
    const [, setIsLoading] = useState(true);
    const [logList, setLogList] = useState<Log[]>([]);
    // const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
    // const [selectedLog, setSelectedLog] = useState<LogDetail | null>(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<LogInput | null>(null);
    const { selectedLogId, setSelectedLogId } = useLogStore();

    // Comment
    // const [commentList, setCommentList] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    // 로그 선택
    // const selectLog = (logId: number) => {
    //     setSelectedLogId(logId);
    // };

    //모달창 종료
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

    // const handleLogSubmit = async (logInput: LogInput) => {
    //     if (typeof id !== "string") return;
    //     if (isNaN(projectId)) return;

    //     // 로그 수정
    //     if (editingLog) {
    //         const updateLog = await patchLog(
    //             projectId,
    //             editingLog.logId,
    //             logInput
    //         );
    //         const updateLogList = logList.map((log) =>
    //             log.logId === editingLog.logId
    //                 ? {
    //                       ...log,
    //                       ...convertToLog(updateLog),
    //                   }
    //                 : log
    //         );
    //         setLogList(updateLogList);
    //         setSelectedLog(updateLog);
    //         setEditingLog(null);
    //     } else {
    //         // 로그 생성
    //         const newLogDetail = createLog(projectId, logInput);
    //         const newLog = convertToLog(await newLogDetail);

    //         setLogList((prev) => [newLog, ...prev]);
    //         selectLog(newLog.logId);
    //     }
    // };

    // 로그 수정 클릭시 모달창을 기존 내용을 담아서 띄우는 함수
    const handleEditLog = (log: LogDetail) => {
        setEditingLog(log);
        setIsLogModalOpen(true);
    };

    // 로그 삭제
    // const handleDeleteLog = (logId: number) => {
    //     if (window.confirm("이 로그를 삭제하시겠습니까?")) {
    //         if (!router.isReady) return;
    //         if (typeof id !== "string") return;
    //         const projectId = Number(id);
    //         if (isNaN(projectId)) return;

    //         deleteLog(projectId, logId);

    //         setLogList(deleteLogList(logList, logId));
    //         setSelectedLog(null);
    //     }
    // };

    // const fetchLogComment = async () => {
    //     if (!router.isReady || !selectedLogId) return;
    //     if (typeof id !== "string") return;
    //     const projectId = Number(id);
    //     if (isNaN(projectId)) return;

    //     try {
    //         setIsLoading(true);
    //         const logDetail = await getLogDetail(projectId, selectedLogId);
    //         const comments = await getCommentList(projectId, logDetail.logId);
    //         const updatedLogList = await getLogList(projectId);

    //         setSelectedLog(logDetail);
    //         setCommentList(comments);
    //         setLogList(updatedLogList);
    //     } catch (err) {
    //         console.error("데이터를 불러오는 데 실패했습니다:", err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // 댓글 생성
    // const handleAddComment = async () => {
    //     if (!selectedLog || newComment.trim() === "") {
    //         return;
    //     }
    //     const projectId = Number(id);
    //     if (isNaN(projectId)) return;

    //     const commentInput: CommentInput = { content: newComment };
    //     const createdComment = await createComment(
    //         projectId,
    //         selectedLog.logId,
    //         commentInput
    //     );

    //     fetchLogComment();
    //     setNewComment("");
    // };

    // 댓글 삭제
    // const handleDeleteComment = async (commentId: number) => {
    //     if (!selectedLog) return;
    //     if (typeof id !== "string") return;
    //     const projectId = Number(id);
    //     if (isNaN(projectId)) return;

    //     try {
    //         await deleteComment(projectId, selectedLog.logId, commentId);
    //     } catch (err) {
    //         console.error(err);
    //     }
    //     fetchLogComment();
    //     setNewComment("");
    // };

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
    // useEffect(() => {
    //     fetchLogComment();
    //     setNewComment("");
    // }, [router.isReady, id, selectedLogId]);

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
                            // newComment={newComment}
                            // onCommentChange={(e) =>
                            //     setNewComment(e.target.value)
                            // }
                            onSummit={handleCreateComment}
                            // onDeleteComment={handleDeleteComment}
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
