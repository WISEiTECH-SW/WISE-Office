import React from "react";
import { User, Send } from "lucide-react";

interface ProjectCommentInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
}

const ProjectCommentInput: React.FC<ProjectCommentInputProps> = ({
    value,
    onChange,
    onSubmit,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };
    return (
        <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
                <textarea
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    placeholder="댓글을 입력하세요..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm"
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1"
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
