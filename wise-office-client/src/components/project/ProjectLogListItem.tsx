import React, { useState } from "react";
import { useRouter } from "next/router";
import { Trash2, MessageCircle } from "lucide-react";
import { Log } from "@/types/log";
import { useLogStore } from "@/store/useLogStore";
import ConfirmModal from "../ConfirmModal";

interface ProjectLogListItemProps {
    log: Log;
    isSelected: boolean;
    onSelect: (logId: number) => void;
    // onDelete: (logId: number) => void;
}

const ProjectLogListItem: React.FC<ProjectLogListItemProps> = ({
    log,
    isSelected,
    onSelect,
    // onDelete,
}) => {
    const router = useRouter();
    const { id } = router.query;
    const projectId = Number(id);
    const { setSelectedLogId } = useLogStore();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모의 onClick 이벤트 방지
        console.log(log.canModify);
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
                        className="text-gray-400 hover:text-red-500 ml-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
            <div className="text-xs text-gray-500 mb-1">{log.writer}</div>
            {/* <div className="text-xs text-gray-400">{log.createdAt}</div> */}
            <div className="flex items-center mt-2 text-xs text-gray-500">
                <MessageCircle className="w-3 h-3 mr-1" />
                {log.commentCnt}
            </div>
            {isConfirmOpen && (
                <ConfirmModal
                    deleteTarget={"log"}
                    projectId={projectId}
                    onClose={() => setIsConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectLogListItem;
