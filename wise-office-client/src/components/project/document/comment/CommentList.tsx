import { DeleteModalState } from "@/types/project";
import { Comment } from "@/types/comment";

import { useCommentMutation } from "@/hooks/queries";

import CommentInput from "./CommentInput";
import CommentListItem from "./CommentListItem";
import { MessageCircle } from "lucide-react";

interface CommentListProps {
    projectId: number;
    logId: number;
    isAttending: boolean;
    commentList: Comment[];
    onDelete: (deleteTarget: DeleteModalState) => void;
}

export default function ProjectCommentList({
    projectId,
    logId,
    isAttending,
    commentList,
    onDelete,
}: CommentListProps) {
    const { createComment, isCommentPending } = useCommentMutation();

    const handleAddComment = (commentInput: string) => {
        createComment({ projectId, logId, commentInput });
    };

    return (
        <div className="p-6 md:p-8 w-full">
            <div className="flex items-center mb-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                <h3 className="font-semibold text-gray-800">
                    댓글 ({commentList.length})
                </h3>
            </div>

            {isAttending && (
                <CommentInput
                    onAdd={handleAddComment}
                    isCommentLoading={isCommentPending}
                />
            )}
            <div className="space-y-4 flex-col w-full">
                {commentList.map((comment) => (
                    <CommentListItem
                        key={comment.id}
                        comment={comment}
                        onDelete={() => {
                            onDelete({ type: "comment", id: comment.id });
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
