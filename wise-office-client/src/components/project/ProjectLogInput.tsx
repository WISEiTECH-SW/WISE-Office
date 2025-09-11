import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import type { LogInput } from "@/types/log";

interface ProjectLogInputProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (logInput: LogInput) => void;
    editingLog?: LogInput | null;
}
export default function ProjectLogInput({
    isOpen,
    onClose,
    onSubmit,
    editingLog,
}: ProjectLogInputProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    React.useEffect(() => {
        if (editingLog) {
            setTitle(editingLog.title);
            setContent(editingLog.content);
        } else {
            setTitle("");
            setContent("");
        }
    }, [editingLog, isOpen]);

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) return;

        onSubmit({
            title: title.trim(),
            content: content.trim(),
        });

        // 폼 초기화
        setTitle("");
        setContent("");
        onClose();
    };

    const handleCancel = () => {
        setTitle("");
        setContent("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {editingLog ? "로그 수정" : "로그 작성"}
                        </h2>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
                    {/* 제목 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            로그 제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="로그 제목을 입력하세요"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            내용
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-y"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!title.trim() || !content.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 cursor-pointer"
                    >
                        <FileText className="w-4 h-4" />
                        <span>{editingLog ? "로그 수정" : "로그 작성"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
