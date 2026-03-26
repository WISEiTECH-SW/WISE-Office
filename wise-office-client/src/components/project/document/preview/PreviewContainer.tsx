import { DeleteModalState, SelectedDocument } from "@/types/project";

import {
    useApproveDetail,
    useComments,
    useLogDetail,
    useMinuteDetail,
    useApproveMutation,
} from "@/hooks/queries";

import BasePreview from "./BasePreview";
import LogPreview from "./LogPreview";
import MinutePreview from "./MinutePreview";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import ApprovePreview from "./ApprovePreview";

interface PreviewContainerProps {
    projectId: number;
    selectedDoc: SelectedDocument;
    isAttending: boolean;
    onEdit: (target: SelectedDocument) => void;
    onDelete: (deleteTarget: DeleteModalState) => void;
    setSelectedDoc: (doc: SelectedDocument) => void;
}

export default function PreviewContainer({
    projectId,
    selectedDoc,
    isAttending,
    onEdit,
    onDelete,
    setSelectedDoc,
}: PreviewContainerProps) {
    const docType = selectedDoc.type;
    const docId = selectedDoc.id ? selectedDoc.id : undefined;

    const { createApprove } = useApproveMutation();

    const logQuery = useLogDetail(
        projectId,
        docType === "log" ? docId : undefined,
    );
    const commentQuery = useComments(
        projectId,
        docType === "log" ? docId : undefined,
    );
    const minuteQuery = useMinuteDetail(
        projectId,
        docType === "minute" ? docId : undefined,
    );
    const approveQuery = useApproveDetail(
        projectId,
        docType === "approve" ? docId : undefined,
    );

    const handleEdit = () => onEdit(selectedDoc);

    const handleCreateApprove = () => {
        if (!docId) return;

        createApprove(
            { projectId, minutesId: docId },
            {
                onSuccess: (data) => {
                    setSelectedDoc({ type: "approve", id: data.approveId });
                    onEdit({ type: "approve", id: data.approveId });
                },
            },
        );
    };

    const queries = [logQuery, commentQuery, minuteQuery, approveQuery];

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    if (!selectedDoc) return <BasePreview type="log" />;
    if (isLoading) return <LoadingIndicator type={"minute"} />;
    if (isError) return <div>에러 발생</div>;

    switch (docType) {
        case "log":
            if (!logQuery.data) return <BasePreview type="log" />;

            return (
                <LogPreview
                    projectId={projectId}
                    logDetail={logQuery.data}
                    commentsList={commentQuery.data}
                    isAttending={isAttending}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                />
            );
        case "minute":
            if (!minuteQuery.data) return <BasePreview type="minute" />;

            return (
                <MinutePreview
                    minuteDetail={minuteQuery.data}
                    isAttending={isAttending}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                    onRelate={setSelectedDoc}
                    createApprove={handleCreateApprove}
                />
            );
        case "approve":
            if (!approveQuery.data) return <BasePreview type="approve" />;

            return (
                <ApprovePreview
                    approve={approveQuery.data}
                    isAttending={isAttending}
                    onEdit={handleEdit}
                    onRelate={setSelectedDoc}
                />
            );
        default:
            return <BasePreview type="log" />;
    }
}
