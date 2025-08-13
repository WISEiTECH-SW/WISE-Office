import React from "react";
import { Trash2, MessageCircle } from "lucide-react";
import { Log } from "./types";

// props의 타입을 명확하게 정의
interface ProjectLogItemProps {
    log: Log;
    isSelected: boolean;
    onSelect: (log: Log) => void;
    onDelete: (logId: number) => void;
}

const ProjectLogItem: React.FC<ProjectLogItemProps> = ({
    log,
    isSelected,
    onSelect,
    onDelete,
}) => {
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모의 onClick 이벤트 방지
        onDelete(log.id);
    };

    return (
        <div
            onClick={() => onSelect(log)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
                    {log.title}
                </h3>
                <button
                    onClick={handleDeleteClick}
                    className="text-gray-400 hover:text-red-500 ml-2"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="text-xs text-gray-500 mb-1">{log.user}</div>
            <div className="text-xs text-gray-400">{log.date}</div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
                <MessageCircle className="w-3 h-3 mr-1" />
                {log.comments.length}
            </div>
        </div>
    );
};

export default ProjectLogItem;
