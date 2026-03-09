import { DeleteModalState, SelectedDocument } from "@/types/project";
import { LogDetail } from "@/types/log";
import { Comment } from "@/types/comment";

import LogPreview from "./log/LogPreview";

import { ClipboardList } from "lucide-react";
import CommentList from "./comment/CommentList";

interface DocumentPreviewProps {
    projectId: number;
    selectedDoc: SelectedDocument | null;
    docDetail: LogDetail | undefined;
    comments?: Comment[];
    isAttending: boolean;
    onEdit: () => void;
    onDelete: (deleteTarget: DeleteModalState) => void;
}

export default function DocumentPreview({
    projectId,
    selectedDoc,
    docDetail,
    comments = [],
    isAttending,
    onEdit,
    onDelete,
}: DocumentPreviewProps) {
    if (!selectedDoc || !docDetail) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-10 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                    <ClipboardList className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm md:text-base font-medium">
                    문서를 선택해주세요
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {selectedDoc.type === "log" && (
                <>
                    <LogPreview
                        logDetail={docDetail}
                        onEdit={onEdit}
                        onDelete={() => {
                            onDelete({ type: "log", id: selectedDoc.id });
                        }}
                    />
                    <CommentList
                        projectId={projectId}
                        logId={docDetail.logId}
                        isAttending={isAttending}
                        commentList={comments}
                        onDelete={onDelete}
                    />
                </>
            )}

            {/* 회의록, 품의서 데이터 추가 후 변경 예정 */}
            {selectedDoc.type === "minute" && <></>}

            {selectedDoc.type === "approve" && <></>}
        </div>
    );
}
