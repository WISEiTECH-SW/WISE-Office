import React from "react";
import ProjectInfoItem from "./ProjectInfoItem";
import { ProjectData } from "./types";
import { Calendar, TrendingUp, User, Users } from "lucide-react";
import {
    calculateProjectDuration,
    formatDateToYearMonth,
} from "@/lib/common/util";

interface ProjectDetailsProps {
    project: ProjectData;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
    project,
    onEdit,
    onDelete,
}) => {
    const duration = calculateProjectDuration(project.start, project.end);
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    {project.title}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        수정
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                        삭제
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                <ProjectInfoItem
                    icon={<Calendar className="w-5 h-5 text-blue-600" />}
                    label="프로젝트 기간"
                    value={`${formatDateToYearMonth(
                        project.start
                    )} ~ ${formatDateToYearMonth(project.end)}`}
                />
                <ProjectInfoItem
                    icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                    label="진행 상태"
                    value={duration}
                />
                <ProjectInfoItem
                    icon={<User className="w-5 h-5 text-blue-600" />}
                    label="책임자"
                    value={project.manager}
                />
                <ProjectInfoItem
                    icon={<Users className="w-5 h-5 text-blue-600" />}
                    label="참여인원"
                    value={`${project.participantsCount}명`}
                />
            </div>
        </div>
    );
};

export default ProjectDetails;
