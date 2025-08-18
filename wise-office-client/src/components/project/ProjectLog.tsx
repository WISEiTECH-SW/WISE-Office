import React from "react";
import { MessageCircle } from "lucide-react";
import { Log } from "./types";
import ProjectLogDetail from "./ProjectLogDetail";
import ProjectCommentList from "./ProjectCommentList";

interface ProjectLogProps {
    selectedLog: Log | null;
    newComment: string;
    onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAddComment: () => void;
    onDeleteComment: (logId: number, commentId: number) => void;
}

const ProjectLog: React.FC<ProjectLogProps> = ({
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
            <ProjectLogDetail log={selectedLog} />
            <ProjectCommentList
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

export default ProjectLog;
