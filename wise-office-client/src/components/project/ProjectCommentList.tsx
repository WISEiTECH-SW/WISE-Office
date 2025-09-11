import React from "react";
import { Comment } from "@/types/comment";
import ProjectCommentListItem from "./ProjectCommentListItem";
import ProjectCommentInput from "./ProjectCommentInput";

interface ProjectCommentListProps {
    commentList: Comment[];
    // newComment: string;
    // onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSummit: (commentInput: string) => void;
    // onDeleteComment: (commentId: number) => void;
}

const ProjectCommentList: React.FC<ProjectCommentListProps> = ({
    commentList,
    // newComment,
    // onCommentChange,
    onSummit,
    // onDeleteComment,
}) => {
    return (
        <div className="p-6 w-full">
            <h3 className="font-semibold text-gray-800 mb-4">
                댓글 ({commentList.length})
            </h3>
            <ProjectCommentInput onSubmit={onSummit} />
            <div className="space-y-4 flex-col w-full">
                {commentList.map((comment) => (
                    <ProjectCommentListItem
                        key={comment.id}
                        comment={comment}
                        // onDelete={onDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectCommentList;
