import React, { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";

interface CommentInputProps {
    onAdd: (commentInput: string) => void;
    isCommentLoading: boolean;
}

export default function CommentInput({
    onAdd,
    isCommentLoading,
}: CommentInputProps) {
    const [content, setContent] = useState("");
    const MAX_COMMENT_LENGTH = 250;

    const handleSubmit = () => {
        if (!content.trim() || isCommentLoading) return;

        onAdd(content);

        setContent("");
    };

    return (
        <div className="flex gap-3 mb-6">
            <div className="flex-1">
                <textarea
                    value={content}
                    maxLength={MAX_COMMENT_LENGTH}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= MAX_COMMENT_LENGTH) {
                            setContent(value);
                        }
                    }}
                    placeholder="댓글을 입력하세요..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-50"
                    disabled={isCommentLoading}
                />
                <span className="mr-2 flex justify-end text-xs text-gray-500">
                    {content.length}/{MAX_COMMENT_LENGTH}
                </span>
                <div className="flex justify-end mt-2">
                    <Button
                        label="댓글 작성"
                        onClick={handleSubmit}
                        variant="primary"
                        icon={<Send className="w-4 h-4" />}
                        isLoading={isCommentLoading}
                        disabled={isCommentLoading || !content.trim()}
                    />
                </div>
            </div>
        </div>
    );
}
