import React from "react";
import { ClipboardList } from "lucide-react";
import { LogDetail, LogInput } from "@/types/log";
import { Comment } from "@/types/comment";

import ProjectLogDetail from "./ProjectLogDetail";
import ProjectCommentList from "./ProjectCommentList";

interface ProjectLogProps {
    selectedLog: LogDetail | null;
    modifyModal: (logInput: LogInput) => void;
    commentList: Comment[];
    // newComment: string;
    // onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSummit: (commentInput: string) => void;
    // onDeleteComment: (commentId: number) => void;
}

const ProjectLog: React.FC<ProjectLogProps> = ({
    selectedLog,
    modifyModal,
    commentList,
    // newComment,
    // onCommentChange,
    onSummit,
    // onDeleteComment,
}) => {
    if (!selectedLog) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-5">
                    <ClipboardList className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-500">로그를 선택해주세요</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <ProjectLogDetail log={selectedLog} modifyModal={modifyModal} />
            <ProjectCommentList
                commentList={commentList}
                // newComment={newComment}
                // onCommentChange={onCommentChange}
                onSummit={onSummit}
                // onDeleteComment={onDeleteComment}
            />
        </div>
    );
};

export default ProjectLog;
