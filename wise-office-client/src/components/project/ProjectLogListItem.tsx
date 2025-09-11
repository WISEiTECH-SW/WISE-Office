import React from "react";
import { Trash2, MessageCircle } from "lucide-react";
import { Log } from "@/types/log";

interface ProjectLogListItemProps {
    log: Log;
    isSelected: boolean;
    onSelect: (logId: number) => void;
    onDelete: (logId: number) => void;
}

export default function ProjectLogListItem({
    log,
    isSelected,
    onSelect,
    onDelete,
}: ProjectLogListItemProps) {
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모의 onClick 이벤트 방지
        onDelete(log.logId);
    };

    return (
        <div
            onClick={() => onSelect(log.logId)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
                    {log.title}
                </h3>
                {log.canModify && (
                    <button
                        onClick={handleDeleteClick}
                        className="text-gray-400 hover:text-red-500 ml-2 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
            <div className="text-xs text-gray-500 mb-1">{log.writer}</div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
                <MessageCircle className="w-3 h-3 mr-1" />
                {log.commentCnt}
            </div>
        </div>
    );
}
