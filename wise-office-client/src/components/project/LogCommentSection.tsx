import React from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { Comment } from "./types";

interface LogCommentSectionProps {
    comments: Comment[];
    newComment: string;
    onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAddComment: () => void;
}

const LogCommentSection: React.FC<LogCommentSectionProps> = ({
    comments,
    newComment,
    onCommentChange,
    onAddComment,
}) => {
    return (
        <div className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
                댓글 ({comments.length})
            </h3>
            <CommentInput
                value={newComment}
                onChange={onCommentChange}
                onSubmit={onAddComment}
            />
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default LogCommentSection;
