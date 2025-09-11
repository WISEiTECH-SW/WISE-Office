import { Comment } from "@/types/comment";
import ProjectCommentListItem from "./ProjectCommentListItem";
import ProjectCommentInput from "./ProjectCommentInput";

interface ProjectCommentListProps {
    logId: number;
    commentList: Comment[];
    onSummit: (commentInput: string) => void;
    onDeleteComment: (commentId: number) => void;
}

export default function ProjectCommentList({
    logId,
    commentList,
    onSummit,
    onDeleteComment,
}: ProjectCommentListProps) {
    return (
        <div className="p-6 w-full">
            <h3 className="font-semibold text-gray-800 mb-4">
                댓글 ({commentList.length})
            </h3>
            <ProjectCommentInput key={logId} onSubmit={onSummit} />
            <div className="space-y-4 flex-col w-full">
                {commentList.map((comment) => (
                    <ProjectCommentListItem
                        key={comment.id}
                        comment={comment}
                        onDelete={onDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
}
