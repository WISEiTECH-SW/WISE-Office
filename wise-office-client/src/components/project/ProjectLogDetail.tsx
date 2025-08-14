import React from "react";
import { Log } from "./types";

interface ProjectLogDetailProps {
    log: Log;
}

const ProjectLogDetail: React.FC<ProjectLogDetailProps> = ({ log }) => {
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
                </div>
            </div>
            <div className="p-6 border-b">
                <p className="text-gray-700 leading-relaxed">{log.content}</p>
            </div>
        </>
    );
};

export default ProjectLogDetail;
