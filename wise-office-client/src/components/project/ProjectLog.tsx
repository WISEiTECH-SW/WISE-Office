import { ClipboardList } from "lucide-react";
import { LogDetail, LogInput } from "@/types/log";
import { Comment } from "@/types/comment";

import ProjectLogDetail from "./ProjectLogDetail";
import ProjectCommentList from "./ProjectCommentList";

interface ProjectLogProps {
    selectedLog: LogDetail | null;
    modifyModal: (logInput: LogInput) => void;
    commentList: Comment[];
    isAttending: boolean;
    onSummit: (commentInput: string) => void;
    onDeleteComment: (target: string, commentId: number) => void;
}

export default function ProjectLog({
    selectedLog,
    modifyModal,
    commentList,
    isAttending,
    onSummit,
    onDeleteComment,
}: ProjectLogProps) {
    if (!selectedLog) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-10 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                    <ClipboardList className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm md:text-base font-medium">
                    로그를 선택해주세요
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <ProjectLogDetail log={selectedLog} modifyModal={modifyModal} />
            <ProjectCommentList
                logId={selectedLog.logId}
                isAttending={isAttending}
                commentList={commentList}
                onSummit={onSummit}
                onDeleteComment={onDeleteComment}
            />
        </div>
    );
}
