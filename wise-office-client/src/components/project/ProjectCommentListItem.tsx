import React from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";
import { Comment } from "@/types/comment";
import { formatDateTime } from "@/lib/common/util";

interface ProjectCommentListItemProps {
    comment: Comment;
    onDelete: (commentId: number) => void;
}

const ProjectCommentListItem: React.FC<ProjectCommentListItemProps> = ({
    comment,
    onDelete,
}) => {
    return (
        <div className="flex gap-3 items-baseline">
            <Image
                src={comment.imageUrl}
                alt="profile image"
                width={32}
                height={32}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
            />

            <div className="flex flex-col bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-800">
                        {comment.authorName}
                    </span>
                    <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                            {formatDateTime(comment.writtenAt)}
                        </span>
                        {comment.canModify && (
                            <button
                                className="text-gray-400 hover:text-red-500 cursor-pointer"
                                onClick={() => onDelete(comment.id)}
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-normal break-all">
                    {comment.content}
                </p>
            </div>
        </div>
    );
};

export default ProjectCommentListItem;
