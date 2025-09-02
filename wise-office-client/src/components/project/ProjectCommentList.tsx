import React from "react";
import { Comment } from "@/types/comment";
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
        <div className="p-6 w-full">
            <h3 className="font-semibold text-gray-800 mb-4">
                댓글 ({comments.length})
            </h3>
            <ProjectCommentInput
                value={newComment}
                onChange={onCommentChange}
                onSubmit={onAddComment}
            />
            <div className="space-y-4 flex-col w-full">
                {comments.map((comment) => (
                    <ProjectCommentListItem
                        key={comment.id}
                        comment={comment}
                        onDelete={onDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectCommentList;
