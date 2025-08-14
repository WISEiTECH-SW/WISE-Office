import React from "react";
import { MessageCircle } from "lucide-react";
import { Log } from "./types";
import LogDetailContent from "./LogDetailContent";
import LogCommentSection from "./LogCommentSection";

interface ProjectLogDetailProps {
    selectedLog: Log | null;
    newComment: string;
    onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAddComment: () => void;
    onDeleteComment: (logId: number, commentId: number) => void;
}

const ProjectLogDetail: React.FC<ProjectLogDetailProps> = ({
    selectedLog,
    newComment,
    onCommentChange,
    onAddComment,
    onDeleteComment,
}) => {
    if (!selectedLog) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-2">
                    <MessageCircle className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-500">로그를 선택해주세요</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <LogDetailContent log={selectedLog} />
            <LogCommentSection
                comments={selectedLog.comments}
                newComment={newComment}
                onCommentChange={onCommentChange}
                onAddComment={onAddComment}
                onDeleteComment={(commentId) =>
                    onDeleteComment(selectedLog.id, commentId)
                }
            />
        </div>
    );
};

export default ProjectLogDetail;
