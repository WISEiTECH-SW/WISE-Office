import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { LogModalState } from "@/types/log";
import {
    DeleteModalState,
    DeleteModalType,
    DocumentType,
    SelectedDocument,
} from "@/types/project";

import { DeleteModal, LogWriteModal, ProjectModal } from "@/components/modal";
import AttendantList from "@/components/project/attendant/AttendantList";
import DocumentSidebar from "@/components/project/document/DocumentSidebar";
import ProjectInfoContainer from "@/components/project/info/ProjectInfoContainer";
import PreviewContainer from "@/components/project/document/preview/PreviewContainer";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import ErrorIndicator from "@/components/ui/ErrorIndicator";

import { useReturnTargetDocStore } from "@/store/useReturnTargetDoc";

import {
    useLogs,
    useMinutes,
    useApproves,
    useProjectDetail,
} from "@/hooks/queries";

export default function ProjectById() {
    const router = useRouter();
    const { query } = router;
    const projectId = Number(query.projectId);

    const { returnTargetDoc, setReturnTargetDoc } = useReturnTargetDocStore();

    /* ----- useState ----- */
    const [selectedDoc, setSelectedDoc] = useState<SelectedDocument>({
        type: "log",
        id: null,
    });
    const [logModalState, setLogModalState] = useState<LogModalState>(null);
    const [deleteModalState, setDeleteModalState] =
        useState<DeleteModalState>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    /* -----query ----- */
    const logs = useLogs(projectId);
    const minutes = useMinutes(projectId);
    const approves = useApproves(projectId);

    const projectDetail = useProjectDetail(projectId);

    /* ----- hook ----- */
    useEffect(() => {
        if (returnTargetDoc) {
            setSelectedDoc(returnTargetDoc);
        }
    }, [returnTargetDoc]);

    /* ----- func ----- */
    const openDocumentEditor = (docType: string, docId: number) => {
        router.push(`/projects/${projectId}/documents/${docType}/${docId}`);
    };

    const handleCreate = (type: DocumentType) => {
        switch (type) {
            case "log":
                setLogModalState({ type: "CREATE" });
                break;
            case "minute":
                setReturnTargetDoc({ type: "minute", id: selectedDoc.id });
                openDocumentEditor("minute", 0);
                break;
            default:
                return;
        }
    };

    const handleEdit = (target: SelectedDocument) => {
        if (!target.id) return;

        switch (target.type) {
            case "log":
                setLogModalState({ type: "EDIT", id: target.id });
                break;
            case "minute":
                setReturnTargetDoc({ type: "minute", id: target.id });
                openDocumentEditor("minute", target.id);
                break;
            case "approve":
                setReturnTargetDoc({ type: "approve", id: target.id });
                openDocumentEditor("approve", target.id);
                break;
            default:
                break;
        }
    };

    const handleDeleteSuccess = (type: DeleteModalType) => {
        setDeleteModalState(null);

        switch (type) {
            case "project":
                router.push("/");
                break;
            case "log":
                setSelectedDoc({ type: "log", id: null });
                break;
            case "comment":
                break;
            case "minute":
                setSelectedDoc({ type: "minute", id: null });
                break;
            default:
                break;
        }
    };

    /* ----- page ----- */
    if (!router.isReady || projectDetail.isLoading)
        return <LoadingIndicator type="project" />;

    if (!projectDetail.data) return <ErrorIndicator />;

    return (
        <div className="md:px-6">
            <ProjectInfoContainer
                projectInfo={projectDetail.data}
                onEdit={() => {
                    setIsEditOpen(true);
                }}
                onDelete={() => {
                    setDeleteModalState({ type: "project", id: projectId });
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
                    attending={projectDetail.data.attending}
                    setSelectedDoc={setSelectedDoc}
                    onWrite={handleCreate}
                />
                {/*Center - Doc Preview*/}

                <div className="order-3 md:col-span-6 mb-6">
                    <PreviewContainer
                        projectId={projectId}
                        selectedDoc={selectedDoc}
                        isAttending={projectDetail.data.attending}
                        onEdit={handleEdit}
                        onDelete={setDeleteModalState}
                        setSelectedDoc={setSelectedDoc}
                    />
                </div>
                {/*Right Side - Attendant List*/}
                <div className="order-1 md:order-3 md:col-span-3 mb-6">
                    <AttendantList
                        pm={projectDetail.data.managerName}
                        attendants={projectDetail.data.attendant}
                        proposalAttendant={projectDetail.data.proposalAttendant}
                    />
                </div>
            </div>
            {/* Modal */}
            {logModalState && (
                <LogWriteModal
                    projectId={projectId}
                    mode={logModalState.type}
                    logId={
                        logModalState.type === "EDIT"
                            ? logModalState.id
                            : undefined
                    }
                    onClose={() => setLogModalState(null)}
                    setSelectedDoc={setSelectedDoc}
                />
            )}
            {deleteModalState && (
                <DeleteModal
                    projectId={projectId}
                    logId={
                        deleteModalState.type === "comment" && selectedDoc.id
                            ? selectedDoc.id
                            : undefined
                    }
                    deleteTargetType={deleteModalState.type}
                    deleteTargetId={deleteModalState.id}
                    onClose={() => setDeleteModalState(null)}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
            {/* Project Update Modal */}
            {isEditOpen && projectDetail.data.projectId && (
                <ProjectModal
                    projectId={projectDetail.data.projectId}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </div>
    );
}
