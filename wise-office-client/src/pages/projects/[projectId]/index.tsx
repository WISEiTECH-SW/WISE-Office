import { useState } from "react";
import { useRouter } from "next/router";

import {
    useProjectDetail,
    useDocumentLists,
} from "@/hooks/project/useDocuments";
import { useLogDetail } from "@/hooks/project/useLogDetail";
import { useMinutesDetail } from "@/hooks/doc/useMinutesDetail";

import { useLogMutation } from "@/hooks/project/useLogMutation";
import { useCommentMutation } from "@/hooks/project/useCommentMutation";

import {
    DeleteModalState,
    DocumentType,
    SelectedDocument,
} from "@/types/project";
import { LogModalState } from "@/types/log";

import ProjectInfoContainer from "@/components/project/info/ProjectInfoContainer";
import DocumentSidebar from "@/components/project/document/DocumentSidebar";
import AttendantList from "@/components/project/attendant/AttendantList";
import { LogWriteModal, DeleteModal, ProjectModal } from "@/components/modal";
import { useProjectMutation } from "@/hooks/project/useProjectMutation";

import BasePreview from "@/components/project/document/preview/BasePreview";
import LogPreview from "@/components/project/document/preview/LogPreview";
import MinutePreview from "@/components/project/document/preview/MinutePreview";
import ApprovePreview from "@/components/project/document/preview/ApprovePreveiw";

export default function ProjectById() {
    const router = useRouter();
    const { query } = router;
    const projectId = Number(query.projectId);

    /* ----- useState ----- */
    // document
    // { type: DocumentType; id: number }
    const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(
        null,
    );

    // modal
    const [logModal, setLogModal] = useState<LogModalState>(null);
    const [deleteTarget, setDeleteTarget] = useState<DeleteModalState>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    /* ----- query ----- */
    const { data: projectInfo } = useProjectDetail(projectId);
    const { logs, minutes } = useDocumentLists(projectId);

    const { log, comments } = useLogDetail(
        projectId,
        selectedDoc ? selectedDoc.id : null,
    );
    const { minute } = useMinutesDetail(
        projectId,
        selectedDoc ? selectedDoc.id : null,
    );

    /* ----- mutation ----- */
    const { deleteLog, isLogLoading } = useLogMutation();
    const { deleteComment, isCommentLoading } = useCommentMutation();
    const { deleteProject } = useProjectMutation();

    /* ----- func ----- */
    const openDocumentEditor = (docType: string, docId: number) => {
        router.push(`/projects/${projectId}/documents/${docType}/${docId}`);
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

    const handleConfirmDelete = () => {
        if (!deleteTarget || !selectedDoc) return;

        switch (deleteTarget.type) {
            // case "project": break;
            case "log":
                deleteLog({ projectId, logId: deleteTarget.id });
                setSelectedDoc({
                    type: "log",
                    id: 0,
                });
                break;
            case "comment":
                deleteComment({
                    projectId,
                    logId: selectedDoc.id,
                    commentId: deleteTarget.id,
                });
                break;
            // case "minute" : break;
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
                    deleteProject(projectId);
                }}
            />
            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-6 mb-10">
                {/* Left Side - Doc List */}
                <DocumentSidebar
                    docData={{
                        logList: logs.data ?? [],
                        minuteList: minutes.data ?? [],
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
                                        minuteDetail={minute}
                                    />
                                );
                            case "approve":
                                return (
                                    <ApprovePreview
                                        projectId={projectId}
                                        approveDetail={undefined}
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
                    isLoading={isCommentLoading || isLogLoading}
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
