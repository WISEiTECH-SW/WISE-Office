import { useState } from "react";
import { useRouter } from "next/router";

import {
    useProjectDetail,
    useDocumentLists,
} from "@/hooks/project/useDocuments";
import { useLogDetail } from "@/hooks/project/useLogDetail";

import { useLogMutation } from "@/hooks/project/useLogMutation";
import { useCommentMutation } from "@/hooks/project/useCommentMutation";

import { DeleteModalState, SelectedDocument } from "@/types/project";
import { LogModalState } from "@/types/log";

import ProjectInfoContainer from "@/components/project/info/ProjectInfoContainer";
import {
    DocumentSidebar,
    DocumentPreview,
} from "@/components/project/document";
import AttendantList from "@/components/project/attendant/AttendantList";
import { LogWriteModal, DeleteModal } from "@/components/modal";

import { toastMessage } from "@/lib/common/toastMessage";

export default function ProjectById() {
    const router = useRouter();
    const { query } = useRouter();
    const projectId = Number(query.projectId);

    /* ----- useState ----- */
    // document
    // { type: DocumentType; id: number }
    const [selectedDoc, setSelectedDoc] = useState<SelectedDocument>({
        type: "log",
        id: 0,
    });

    // modal
    const [logModal, setLogModal] = useState<LogModalState>(null);
    const [deleteTarget, setDeleteTarget] = useState<DeleteModalState>(null);

    /* ----- query ----- */
    const { data: projectInfo } = useProjectDetail(projectId);
    const { logs } = useDocumentLists(projectId);

    const { log, comments } = useLogDetail(
        projectId,
        selectedDoc.type === "log" ? selectedDoc.id : null,
    );

    /* ----- mutation ----- */
    const { deleteLog, isLogLoading } = useLogMutation(
        projectId,
        selectedDoc.id,
    );
    const { removeComment, isCommentLoading } = useCommentMutation(
        projectId,
        selectedDoc.id,
    );

    /* ----- func ----- */
    const setEditLog = () => {
        if (log) {
            setLogModal({
                type: "EDIT",
                data: { title: log.title, content: log.content },
            });
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;

        const options = {
            onSuccess: () => {
                setDeleteTarget(null);
                toastMessage.success("삭제가 완료 되었습니다.");
            },
            onError: () => {
                toastMessage.error("삭제에 실패 했습니다.");
            },
        };

        switch (deleteTarget.type) {
            // case "project": break;
            case "log":
                deleteLog(undefined, options);
                setSelectedDoc({
                    type: "log",
                    id: 0,
                });
                break;
            case "comment":
                removeComment(deleteTarget.id, options);
                break;
            // case "minute" : break;
            // case "approve": break;
        }
    };

    const handleDocumentClick = (docType: string, docId: number) => {
        router.push(`/projects/${projectId}/documents/${docType}/${docId}`);
    };

    /* ----- page ----- */
    if (!projectInfo) return <div>!!No Project!!</div>;

    return (
        <div className="md:px-6">
            <ProjectInfoContainer
                projectInfo={projectInfo}
                onEdit={() => {}}
                onDelete={() => {}}
            />

            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-6 mb-10">
                {/* Left Side - Doc List */}
                <div className="order-2 md:order-1 md:col-span-3 mb-6">
                    <DocumentSidebar
                        logList={logs.data ?? []}
                        selectedDocument={selectedDoc}
                        onSelectDocument={setSelectedDoc}
                        attending={projectInfo.attending}
                        onButtonClick={
                            selectedDoc.type === "log"
                                ? () => setLogModal({ type: "CREATE" })
                                : () =>
                                      handleDocumentClick(
                                          "minute",
                                          selectedDoc.id,
                                      )
                        }
                    />
                </div>
                {/*Center - Doc Preview*/}
                <div className="order-3 md:col-span-6 mb-6">
                    <DocumentPreview
                        projectId={projectId}
                        selectedDoc={selectedDoc}
                        docDetail={log}
                        comments={comments ?? []}
                        isAttending={projectInfo.attending}
                        onEdit={
                            selectedDoc.type === "log" ? setEditLog : () => {}
                        }
                        onDelete={setDeleteTarget}
                    />
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
                    logId={selectedDoc.id}
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
        </div>
    );
}
