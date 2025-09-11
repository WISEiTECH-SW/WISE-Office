import { LogDetail, LogInput } from "@/types/log";
import { formatDateTime } from "@/lib/common/util";
import { convertToLogInput } from "@/lib/project/log";

interface ProjectLogDetailProps {
    log: LogDetail;
    modifyModal: (logInput: LogInput) => void;
}

export default function ProjectLogDetail({
    log,
    modifyModal,
}: ProjectLogDetailProps) {
    return (
        <div>
            <div className="border-b p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 break-words whitespace-normal">
                    {log.title}
                </h2>
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium">{log.writer}</span>
                        <span className="mx-1.5">•</span>
                        <span>{formatDateTime(log.createdAt)}</span>
                    </div>
                    {log.canModify && (
                        <button
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center justify-center cursor-pointer"
                            onClick={() => modifyModal(convertToLogInput(log))}
                        >
                            수정
                        </button>
                    )}
                </div>
            </div>
            <div className="p-6 border-b">
                <p className="text-gray-700 leading-relaxed break-words whitespace-normal">
                    {log.content}
                </p>
            </div>
        </div>
    );
}
