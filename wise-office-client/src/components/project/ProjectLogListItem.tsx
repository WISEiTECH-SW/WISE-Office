import React from "react";
import { MessageCircle } from "lucide-react";
import { Log } from "@/types/log";

interface ProjectLogListItemProps {
    log: Log;
    isSelected: boolean;
    onSelect: (logId: number) => void;
}

export default function ProjectLogListItem({
    log,
    isSelected,
    onSelect,
}: ProjectLogListItemProps) {
    return (
        <div
            onClick={() => onSelect(log.logId)}
            className={`w-40 flex-none md:w-full p-4 border-r md:border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected
                    ? "bg-blue-50 border-t-4 md:border-l-4 md:border-t-0 border-t-blue-500 md:border-l-blue-500 "
                    : ""
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-sm text-gray-800 truncate">
                    {log.title}
                </h3>
            </div>

            <div className="flex mt-2 justify-between">
                <div className="text-xs text-gray-500">{log.writer}</div>
                <div className="flex items-center text-xs text-gray-500">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {log.commentCnt}
                </div>
            </div>
        </div>
    );
}
