import React from "react";
import ProjectLogListItem from "./ProjectLogListItem";
import { Log } from "./types";

interface ProjectLogListProps {
    logs: Log[];
    selectedLog?: Log | null;
    onSelectLog: (log: Log) => void;
    onDeleteLog: (logId: number) => void;
}

const ProjectLogList: React.FC<ProjectLogListProps> = ({
    logs,
    selectedLog,
    onSelectLog,
    onDeleteLog,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 px-4 py-3 rounded-t-lg flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">LOG</h2>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {logs.map((log) => (
                    <ProjectLogListItem
                        key={log.id}
                        log={log}
                        isSelected={selectedLog?.id === log.id}
                        onSelect={onSelectLog}
                        onDelete={onDeleteLog}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectLogList;
