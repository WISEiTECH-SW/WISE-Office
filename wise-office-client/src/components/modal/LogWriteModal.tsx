import React, { useEffect, useState } from "react";
import { X, FileText } from "lucide-react";

import type { LogInput } from "@/types/log";
import { SelectedDocument } from "@/types/project";

import { useLogDetail, useLogMutation } from "@/hooks/queries";

import Button from "../ui/Button";
import LoadingIndicator from "../ui/LoadingIndicator";
import { MAX_LENGTH } from "@/constants/config";
import { useScrollLock } from "@/hooks/useBodyScrollLock";

interface LogWriteModalProps {
    projectId: number;
    mode: "CREATE" | "EDIT";
    logId?: number;
    onClose: () => void;
    setSelectedDoc: (doc: SelectedDocument) => void;
}
export default function LogWriteModal({
    projectId,
    mode,
    logId,
    onClose,
    setSelectedDoc,
}: LogWriteModalProps) {
    const isEditMode = mode === "EDIT";
    /* ----- useState -----*/
    const [form, setForm] = useState<LogInput>({
        title: "",
        content: "",
    });

    /* ----- query -----*/
    const { data, isLoading } = useLogDetail(projectId, logId);
    const { createLog, updateLog, isLogPending } = useLogMutation();

    /* ----- hook -----*/
    useEffect(() => {
        if (isEditMode && data) {
            setForm({
                title: data.title,
                content: data.content,
            });
        }
    }, [isEditMode, data]);

    useScrollLock();

    /* ----- func -----*/
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length <= MAX_LENGTH.SHORT) {
            setForm({ ...form, title: value });
        }
    };

    const handleSubmit = () => {
        if (isEditMode && logId) {
            updateLog(
                { projectId, logId, logInput: form },
                {
                    onSuccess: () => {
                        onClose();
                    },
                },
            );
        } else {
            createLog(
                { projectId, logInput: form },
                {
                    onSuccess: (data) => {
                        onClose();
                        setSelectedDoc({ type: "log", id: data.logId });
                    },
                },
            );
        }
    };

    /* ----- ui -----*/
    if (isEditMode && isLoading) return <LoadingIndicator type="log" />;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
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

                <div className="px-6 py-4 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
                    {/* 제목 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            로그 제목
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={form.title}
                                onChange={handleTitleChange}
                                placeholder="로그 제목을 입력하세요"
                                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                {form.title.length}/{MAX_LENGTH.SHORT}
                            </span>
                        </div>
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            내용
                        </label>
                        <div>
                            <textarea
                                value={form.content}
                                maxLength={MAX_LENGTH.LONG}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= MAX_LENGTH.LONG) {
                                        setForm({ ...form, content: value });
                                    }
                                }}
                                placeholder="내용을 입력하세요"
                                className="w-full min-h-[250px] px-3 py-2 border border-gray-300
                                        rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        outline-none transition-colors resize-none
                                        custom-scroll cursor-text [&::-webkit-scrollbar-thumb]:cursor-default 
                                        [&::-webkit-scrollbar-thumb:hover]:cursor-default"
                            />
                            <span className="mr-2 flex justify-end text-xs text-gray-500">
                                {form.content.length}/{MAX_LENGTH.LONG}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <Button
                        label={isEditMode ? "수정" : "작성"}
                        onClick={handleSubmit}
                        variant="primary"
                        isLoading={isLogPending}
                        disabled={!form.title.trim() || !form.content.trim()}
                    />
                    <Button
                        label="취소"
                        onClick={onClose}
                        variant="secondary"
                        isLoading={isLogPending}
                    />
                </div>
            </div>
        </div>
    );
}
