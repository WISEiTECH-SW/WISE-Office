"use client";
import ProjectLogListItem from "./ProjectLogListItem";
import { Log, LogDetail } from "@/types/log";

interface ProjectLogListProps {
    logList: Log[];
    selectedLog?: LogDetail | null;
    onSelectLog: (logId: number) => void;
    onDeleteLog: (target: string, logId: number) => void;
}

export default function ProjectLogList({
    logList,
    selectedLog,
    onSelectLog,
    onDeleteLog,
}: ProjectLogListProps) {
    return (
        <div className="md:min-h-52 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 p-2 md:p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                    LOG
                </h3>
            </div>

            <div className="md:max-h-85 flex flex-nowrap pb-1 overflow-x-auto md:flex-col scrollbar-auto-hide">
                {logList.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-4 md:py-10">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm md:text-base font-medium">
                                작성된 로그가 없습니다.
                            </p>
                            <p className="text-gray-300 text-xs md:text-sm mt-1">
                                첫 로그를 작성해보세요 ✍️
                            </p>
                        </div>
                    </div>
                ) : (
                    logList.map((log) => (
                        <ProjectLogListItem
                            key={log.logId}
                            log={log}
                            isSelected={selectedLog?.logId === log.logId}
                            onSelect={onSelectLog}
                            onDelete={onDeleteLog}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
