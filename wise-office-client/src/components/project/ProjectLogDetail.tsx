import React from "react";
import { Log } from "@/components/project/types";

interface ProjectLogDetailProps {
    log: Log;
    handleEditLog: (log: Log) => void;
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
                    <span className="font-medium">{log.user}</span>
                    <span className="mx-2">•</span>
                    <span>{log.date}</span>
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
