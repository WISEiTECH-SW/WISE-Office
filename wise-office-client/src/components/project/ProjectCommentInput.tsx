import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";

interface ProjectCommentInputProps {
    onSubmit: (commentInput: string) => void;
}

const ProjectCommentInput: React.FC<ProjectCommentInputProps> = ({
    onSubmit,
}) => {
    const [content, setContent] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!content.trim()) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(content);
            setContent("");
        }
    };

    const handleSummit = () => {
        if (!content.trim()) return;
        onSubmit(content);
        setContent("");
    };

    return (
        <div className="flex gap-3 mb-6">
            <div className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="댓글을 입력하세요..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSummit}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                        댓글 작성
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCommentInput;
