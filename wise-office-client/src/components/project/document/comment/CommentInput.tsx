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

    const handleSubmit = () => {
        if (!content.trim() || isCommentLoading) return;

        onAdd(content);

        setContent("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit();
        }
    };

    return (
        <div className="flex gap-3 mb-6">
            <div className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="댓글을 입력하세요..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-50"
                    disabled={isCommentLoading}
                />
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
