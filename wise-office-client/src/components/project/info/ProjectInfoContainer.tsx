import type { ProjectInfo } from "@/types/project";

import ProjectInfoItem from "./ProjectInfoItem";
import Button from "@/components/common/Button";

import {
    Calendar,
    TrendingUp,
    User,
    Users,
    NotepadText,
    Edit,
    Trash2,
} from "lucide-react";

import {
    calculateProjectDuration,
    calculationDuration,
    formatYearMonth,
} from "@/lib/common/util";

type ProjectContainerProps = {
    projectInfo: ProjectInfo;
    onEdit: () => void;
    onDelete: () => void;
};

export default function ProjectInfoContainer({
    projectInfo,
    onEdit,
    onDelete,
}: ProjectContainerProps) {
    const duration = calculateProjectDuration(
        projectInfo.start,
        projectInfo.end,
    );
    const titleDuration = calculationDuration(projectInfo.start);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mt-6">
            <div className="flex justify-between items-start mb-4">
                <p className="text-lg md:text-2xl font-bold text-gray-800 break-words whitespace-normal">
                    {duration.state === "진행중" && `(${titleDuration})`}
                    {projectInfo.projectTitle}
                </p>
                {projectInfo.canModify && (
                    <div className="flex ml-4 gap-2 flex-shrink-0">
                        <Button
                            label="수정"
                            onClick={onEdit}
                            variant="secondary"
                            icon={<Edit className="h-4 w-4" />}
                        />
                        <Button
                            label="삭제"
                            onClick={onDelete}
                            variant="danger"
                            icon={<Trash2 className="h-4 w-4" />}
                        />
                    </div>
                )}
            </div>
            <div className="grid md:grid-cols-4 gap-2 md:gap-6 mb-2 md:mb-6">
                <ProjectInfoItem
                    icon={<Calendar className="w-5 h-5 md:w-6 md:h-6" />}
                    label="프로젝트 기간"
                    value={`${formatYearMonth(
                        projectInfo.start,
                    )} ~ ${formatYearMonth(projectInfo.end)}`}
                />
                <ProjectInfoItem
                    icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />}
                    label="진행 상태"
                    value={duration.duration}
                />
                <ProjectInfoItem
                    icon={<User className="w-5 h-5 md:w-6 md:h-6" />}
                    label="책임자"
                    value={projectInfo.managerName.name}
                />
                <ProjectInfoItem
                    icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
                    label="참여 인원"
                    value={`${projectInfo.attendant.length + 1}명`}
                />
            </div>

            <ProjectInfoItem
                icon={<NotepadText className="w-5 h-5 md:w-6 md:h-6" />}
                label="프로젝트 설명"
                value={projectInfo.detail}
            />
        </div>
    );
}
