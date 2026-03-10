import React, { useState } from "react";
import { X, FileText } from "lucide-react";

import type { LogInput } from "@/types/log";
import { SelectedDocument } from "@/types/project";

import { useLogMutation } from "@/hooks/project/useLogMutation";
import { toastMessage } from "@/lib/common/toastMessage";
import Button from "../common/Button";

interface LogWriteModalProps {
    projectId: number;
    logId: number | null;
    initialData: LogInput | null;
    onClose: () => void;
    setSelectedDoc: (doc: SelectedDocument) => void;
}
export default function LogWriteModal({
    projectId,
    logId,
    initialData,
    onClose,
    setSelectedDoc,
}: LogWriteModalProps) {
    const isEditMode = !!initialData;
    const { createLog, updateLog, isLogLoading } = useLogMutation(
        projectId,
        logId!,
    );
    const [formData, setFormData] = useState<LogInput>({
        title: initialData?.title ?? "",
        content: initialData?.content ?? "",
    });

    const handleSubmit = () => {
        if (isEditMode && initialData) {
            updateLog(formData, {
                onSuccess: () => {
                    toastMessage.success("로그가 수정되었습니다.");
                    onClose();
                },
            });
        } else {
            createLog(formData, {
                onSuccess: (data) => {
                    onClose();
                    toastMessage.success("로그가 작성되었습니다.");
                    setSelectedDoc({ type: "log", id: data.logId });
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* 제목 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEditMode ? "로그 수정" : "로그 작성"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
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
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
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
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    content: e.target.value,
                                })
                            }
                            placeholder="내용을 입력하세요"
                            className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-y"
                        />
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <Button
                        label={isEditMode ? "수정" : "작성"}
                        onClick={handleSubmit}
                        variant="primary"
                        isLoading={isLogLoading}
                        disabled={
                            !formData.title.trim() || !formData.content.trim()
                        }
                    />
                    <Button
                        label="취소"
                        onClick={onClose}
                        variant="secondary"
                        isLoading={isLogLoading}
                    />
                </div>
            </div>
        </div>
    );
}
