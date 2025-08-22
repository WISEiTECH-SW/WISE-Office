import React from "react";
import { LogDetail } from "@/types/log";
import { formatDateTime } from "@/lib/common/util";

interface ProjectLogDetailProps {
    log: LogDetail;
    handleEditLog: (log: LogDetail) => void;
}

const ProjectLogDetail: React.FC<ProjectLogDetailProps> = ({
    log,
    handleEditLog,
}) => {
    return (
        <>
            <div className="border-b p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {log.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">{log.writer}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDateTime(log.createdAt)}</span>
                    <span className="mx-2">•</span>
                    <button
                        className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={() => handleEditLog(log)}
                    >
                        수정
                    </button>
                </div>
            </div>
            <div className="p-6 border-b">
                <p className="text-gray-700 leading-relaxed">{log.content}</p>
            </div>
        </>
    );
};

export default ProjectLogDetail;
