import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useMinutesDetail } from "@/hooks/doc/useMinutesDetail";
import {
    useApproveDetail,
    useDocumentLists,
    useProjectDetail,
} from "@/hooks/project/useDocuments";
import { useLogDetail } from "@/hooks/project/useLogDetail";

import { useCommentMutation } from "@/hooks/project/useCommentMutation";
import { useLogMutation } from "@/hooks/project/useLogMutation";

import { api } from "@/lib/clientApi";
import {
    getDocumentToastMessage,
    toastMessage,
} from "@/lib/common/toastMessage";
import { LogModalState } from "@/types/log";
import {
    DeleteModalState,
    DocumentType,
    SelectedDocument,
} from "@/types/project";

import { DeleteModal, LogWriteModal, ProjectModal } from "@/components/modal";
import AttendantList from "@/components/project/attendant/AttendantList";
import DocumentSidebar from "@/components/project/document/DocumentSidebar";
import ProjectInfoContainer from "@/components/project/info/ProjectInfoContainer";
import { useProjectMutation } from "@/hooks/project/useProjectMutation";

import ApprovePreview from "@/components/project/document/preview/ApprovePreveiw";
import BasePreview from "@/components/project/document/preview/BasePreview";
import LogPreview from "@/components/project/document/preview/LogPreview";
import MinutePreview from "@/components/project/document/preview/MinutePreview";

export default function ProjectById() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { query } = router;
    const projectId = Number(query.projectId);

    /* ----- useState ----- */
    // document
    // { type: DocumentType; id: number }
    const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(
        null,
    );
    useEffect(() => {
        const { type, docId } = router.query;

        if (type && docId) {
            setSelectedDoc({
                type: type as DocumentType,
                id: Number(docId),
            });
        }
    }, [router.query]);
    // modal
    const [logModal, setLogModal] = useState<LogModalState>(null);
    const [deleteTarget, setDeleteTarget] = useState<DeleteModalState>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMinuteDeleting, setIsMinuteDeleting] = useState(false);

    /* ----- query ----- */
    const { data: projectInfo } = useProjectDetail(projectId);
    const { logs, minutes, approves } = useDocumentLists(projectId);

    const { log, comments } = useLogDetail(
        projectId,
        selectedDoc?.type === "log" ? selectedDoc.id : null,
    );
    const { minute } = useMinutesDetail(
        projectId,
        selectedDoc?.type === "minute" ? selectedDoc.id : null,
    );
    const approveId =
        selectedDoc?.type === "approve" ? selectedDoc.id : undefined;
    const { data } = useApproveDetail(projectId, approveId);

    /* ----- mutation ----- */
    const { deleteLog, isLogLoading } = useLogMutation();
    const { deleteComment, isCommentLoading } = useCommentMutation();
    const { deleteProject } = useProjectMutation();

    /* ----- func ----- */
    const openDocumentEditor = (docType: string, docId: number) => {
        router.push(`/projects/${projectId}/documents/${docType}/${docId}`);
    };

    const handleSelectApprove = (approveId: number) => {
        setSelectedDoc({ type: "approve", id: approveId });
    };

    const handleSelectMinute = (minutesId: number) => {
        setSelectedDoc({ type: "minute", id: minutesId });
    };

    const handleWrite = (type: DocumentType) => {
        switch (type) {
            case "log":
                setLogModal({ type: "CREATE" });
                break;
            case "minute":
                openDocumentEditor("minute", 0);
                break;
            default:
                return;
        }
    };

    const setEditLog = () => {
        if (log) {
            setLogModal({
                type: "EDIT",
                data: { title: log.title, content: log.content },
            });
        }
    };

    const handleDeleteMinute = async (minutesId: number) => {
        try {
            setIsMinuteDeleting(true);
            await api.delete(`/projects/${projectId}/minutes/${minutesId}`);

            setSelectedDoc((current) => {
                if (current?.type === "minute" && current.id === minutesId) {
                    return { type: "minute", id: 0 };
                }
                return current;
            });

            setDeleteTarget(null);

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["minutes", projectId],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["approves", projectId],
                }),
            ]);

            queryClient.removeQueries({
                queryKey: ["minutes", projectId, minutesId],
            });

            toastMessage.success(getDocumentToastMessage("minute", "delete"));
        } catch {
            toastMessage.error("회의록 삭제에 실패했습니다.");
        } finally {
            setIsMinuteDeleting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget || !selectedDoc) return;

        switch (deleteTarget.type) {
            case "project":
                deleteProject(projectId);
                break;
            case "log":
                deleteLog({ projectId, logId: deleteTarget.id });
                setSelectedDoc(null);
                break;
            case "comment":
                deleteComment({
                    projectId,
                    logId: selectedDoc.id,
                    commentId: deleteTarget.id,
                });
                break;
            case "minute":
                await handleDeleteMinute(deleteTarget.id);
                return;
            // case "approve": break;
        }

        setDeleteTarget(null);
    };

    /* ----- page ----- */
    if (!projectInfo) return <div>!!No Project!!</div>;

    return (
        <div className="md:px-6">
            <ProjectInfoContainer
                projectInfo={projectInfo}
                onEdit={() => {
                    setIsEditOpen(true);
                }}
                onDelete={() => {
                    setDeleteTarget({ type: "project", id: projectId });
                }}
            />
            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-6 mb-10">
                {/* Left Side - Doc List */}
                <DocumentSidebar
                    docData={{
                        logList: logs.data ?? [],
                        minuteList: minutes.data ?? [],
                        approveList: approves.data ?? [],
                    }}
                    selectedDoc={selectedDoc}
                    attending={projectInfo.attending}
                    setSelectedDoc={setSelectedDoc}
                    onWrite={handleWrite}
                />
                {/*Center - Doc Preview*/}
                <div className="order-3 md:col-span-6 mb-6">
                    {(() => {
                        switch (selectedDoc?.type) {
                            case "log":
                                return (
                                    <LogPreview
                                        projectId={projectId}
                                        logDetail={log}
                                        commentsList={comments}
                                        isAttending={projectInfo.attending}
                                        onEdit={setEditLog}
                                        onDelete={setDeleteTarget}
                                    />
                                );

                            case "minute":
                                return (
                                    <MinutePreview
                                        projectId={projectId}
                                        projectTitle={projectInfo.projectTitle}
                                        minuteDetail={minute}
                                        isAttending={projectInfo.attending}
                                        onEdit={openDocumentEditor}
                                        onDelete={setDeleteTarget}
                                        onSelectApprove={handleSelectApprove}
                                    />
                                );
                            case "approve":
                                return (
                                    <ApprovePreview
                                        projectId={projectId}
                                        approve={data}
                                        onSelectMinute={handleSelectMinute}
                                    />
                                );
                            default:
                                return <BasePreview type="log" />;
                        }
                    })()}
                </div>
                {/*Right Side - Attendant List*/}
                <div className="order-1 md:order-3 md:col-span-3 mb-6">
                    <AttendantList
                        pm={projectInfo.managerName}
                        attendants={projectInfo.attendant}
                        proposalAttendant={projectInfo.proposalAttendant}
                    />
                </div>
            </div>
            {/* Modal */}
            {logModal && (
                <LogWriteModal
                    projectId={projectId}
                    logId={selectedDoc ? selectedDoc.id : null}
                    initialData={
                        logModal.type === "EDIT" ? logModal.data : null
                    }
                    onClose={() => setLogModal(null)}
                    setSelectedDoc={setSelectedDoc}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    deleteTarget={deleteTarget}
                    onDelete={handleConfirmDelete}
                    onClose={() => setDeleteTarget(null)}
                    isLoading={
                        isCommentLoading || isLogLoading || isMinuteDeleting
                    }
                />
            )}
            {/* Project Update Modal */}
            {isEditOpen && projectInfo.projectId && (
                <ProjectModal
                    mode={"update"}
                    projectId={projectInfo.projectId}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </div>
    );
}
