import ProjectInfoItem from "./ProjectInfoItem";
import type { ProjectInfo } from "@/types/project";
import { calculationDuration } from "@/lib/common/util";
import { Calendar, TrendingUp, User, Users } from "lucide-react";

type ProjectContainerProps = {
    projectInfo: ProjectInfo;
    onEdit?: () => void;
    onDelete?: () => void;
};

export default function ProjectInfoContainer({
    projectInfo,
    onEdit,
    onDelete,
}: ProjectContainerProps) {
    const duration = calculationDuration(projectInfo.start);
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    {projectInfo.projectTitle}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 cursor-pointer"
                    >
                        수정
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 cursor-pointer"
                    >
                        삭제
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                <ProjectInfoItem
                    icon={<Calendar className="w-7 h-7 text-blue-600" />}
                    label="프로젝트 기간"
                    value={`${projectInfo.start} ~ ${projectInfo.end}`}
                />
                <ProjectInfoItem
                    icon={<TrendingUp className="w-7 h-7 text-blue-600" />}
                    label="진행 상태"
                    value={duration}
                />
                <ProjectInfoItem
                    icon={<User className="w-7 h-7 text-blue-600" />}
                    label="책임자"
                    value={projectInfo.managerName.name}
                />
                <ProjectInfoItem
                    icon={<Users className="w-7 h-7 text-blue-600" />}
                    label="참여인원"
                    value={`${projectInfo.attendant.length}명`}
                />
            </div>
        </div>
    );
}
