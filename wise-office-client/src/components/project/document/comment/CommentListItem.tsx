import { Comment } from "@/types/comment";
import { XCircle } from "lucide-react";
import { formatDateTime } from "@/lib/common/util";
import ProfileImage from "@/components/header/ProfileImage";

interface CommentListItemProps {
    comment: Comment;
    onDelete: (target: string, ommentId: number) => void;
}

export default function CommentListItem({
    comment,
    onDelete,
}: CommentListItemProps) {
    return (
        <div className="flex gap-3 items-baseline">
            <div className="relative w-10 h-10 shrink-0">
                <ProfileImage imageUrl={comment.imageUrl} />
            </div>
            <div className="flex flex-col flex-grow bg-gray-50 rounded-lg p-3">
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
                                onClick={() => onDelete("comment", comment.id)}
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
}
