import React from "react";
import { User, XCircle } from "lucide-react";
import { Comment } from "./types";

interface ProjectCommentListItemProps {
    comment: Comment;
    onDelete: (commentId: number) => void;
}

const ProjectCommentListItem: React.FC<ProjectCommentListItemProps> = ({
    comment,
    onDelete,
}) => {
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
                        <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                                {comment.date}
                            </span>
                            <button
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => onDelete(comment.id)}
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectCommentListItem;
