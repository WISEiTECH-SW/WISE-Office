import React from "react";
import { Comment } from "./types";
import ProjectCommentListItem from "./ProjectCommentListItem";
import ProjectCommentInput from "./ProjectCommentInput";

interface ProjectCommentListProps {
    comments: Comment[];
    newComment: string;
    onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAddComment: () => void;
    onDeleteComment: (commentId: number) => void;
}

const ProjectCommentList: React.FC<ProjectCommentListProps> = ({
    comments,
    newComment,
    onCommentChange,
    onAddComment,
    onDeleteComment,
}) => {
    return (
        <div className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
                댓글 ({comments.length})
            </h3>
            <ProjectCommentInput
                value={newComment}
                onChange={onCommentChange}
                onSubmit={onAddComment}
            />
            <div className="space-y-4">
                {comments.map((comment) => (
                    <ProjectCommentListItem
                        key={comment.id}
                        comment={comment}
                        onDelete={() => onDeleteComment(comment.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectCommentList;
