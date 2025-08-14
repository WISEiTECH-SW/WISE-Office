import React from "react";
import { User } from "lucide-react";
import { Comment } from "./types";

interface CommentItemProps {
    comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-800">
                            {comment.user}
                        </span>
                        <span className="text-xs text-gray-500">
                            {comment.date}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
