import { LogDetail, LogInput } from "@/types/log";
import { formatDateTime } from "@/lib/common/util";
import { convertToLogInput } from "@/lib/project/log";
import ProfileImage from "../header/ProfileImage";
import { Edit, Trash2 } from "lucide-react";

interface ProjectLogDetailProps {
    log: LogDetail;
    modifyModal: (logInput: LogInput) => void;
    onDelete: (target: string, logId: number) => void;
}

export default function ProjectLogDetail({
    log,
    modifyModal,
    onDelete,
}: ProjectLogDetailProps) {
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모의 onClick 이벤트 방지
        onDelete("log", log.logId);
    };
    return (
        <div className="flex flex-col p-4 md:p-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4 ">
                <div className="flex gap-4 items-center text-gray-500">
                    <div className="relative w-12 h-12 rounded-full border-2 border-white">
                        <ProfileImage imageUrl={log.imageUrl} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-medium">
                            {log.writer}
                        </span>
                        <span className="text-sm">
                            {formatDateTime(log.createdAt)}
                        </span>
                    </div>
                </div>

                {log.canModify && (
                    <div className="flex ml-4 gap-2 flex-shrink-0">
                        <button
                            onClick={() => modifyModal(convertToLogInput(log))}
                            className="p-2 md:px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1 cursor-pointer"
                        >
                            <Edit className="h-4 w-4 md:hidden" />
                            <p className="hidden md:block">수정</p>
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 md:px-4 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4 md:hidden" />
                            <p className="hidden md:block">삭제</p>
                        </button>
                    </div>
                )}
            </div>

            <h2 className="p-1 text-lg md:text-xl font-bold text-gray-800 break-words whitespace-normal mb-2 md:mb-4">
                {log.title}
            </h2>

            <p className="p-1 text-gray-700 leading-relaxed break-words whitespace-pre-line">
                {log.content}
            </p>
        </div>
    );
}
