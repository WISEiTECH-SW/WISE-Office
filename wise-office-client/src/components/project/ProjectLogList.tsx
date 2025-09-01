import React from "react";
import ProjectLogListItem from "./ProjectLogListItem";
import { Log, LogDetail } from "@/types/log";

interface ProjectLogListProps {
    logList: Log[];
    selectedLog?: LogDetail | null;
    onSelectLog: (logId: number) => void;
    // onDeleteLog: (logId: number) => void;
}

const ProjectLogList: React.FC<ProjectLogListProps> = ({
    logList,
    selectedLog,
    onSelectLog,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 px-4 py-3 rounded-t-lg flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">LOG</h2>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {logList.map((log) => (
                    <ProjectLogListItem
                        key={log.logId}
                        log={log}
                        isSelected={selectedLog?.logId === log.logId}
                        onSelect={onSelectLog}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectLogList;
