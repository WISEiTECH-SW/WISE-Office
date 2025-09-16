import ProjectInfoItem from "./ProjectInfoItem";
import type { ProjectInfo } from "@/types/project";
import { calculationDuration, formatYearMonth } from "@/lib/common/util";
import {
    Calendar,
    TrendingUp,
    User,
    Users,
    NotepadText,
    Edit,
    Trash,
} from "lucide-react";

type ProjectContainerProps = {
    projectInfo: ProjectInfo;
    onEdit?: () => void;
    onDelete: () => void;
};

export default function ProjectInfoContainer({
    projectInfo,
    onEdit,
    onDelete,
}: ProjectContainerProps) {
    const duration = calculationDuration(projectInfo.start);
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mt-6">
            <div className="flex justify-between items-center mb-4">
                {/* <div className="flex-grow min-w-0"> */}
                <p className="text-lg md:text-2xl font-bold text-gray-800 truncate">
                    {projectInfo.projectTitle}
                </p>
                {/* </div> */}
                {projectInfo.canModify && (
                    <div className="flex ml-4 gap-2 flex-shrink-0">
                        <button
                            onClick={onEdit}
                            className="p-2 md:px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 cursor-pointer"
                        >
                            <Edit className="h-4 w-4 md:hidden" />
                            <p className="hidden md:block">수정</p>
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 md:px-4 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 cursor-pointer"
                        >
                            <Trash className="h-4 w-4 md:hidden" />
                            <p className="hidden md:block">삭제</p>
                        </button>
                    </div>
                )}
            </div>
            <div className="grid md:grid-cols-4 gap-2 md:gap-6 mb-2 md:mb-6">
                <ProjectInfoItem
                    icon={<Calendar className="w-5 h-5 md:w-6 md:h-6" />}
                    label="프로젝트 기간"
                    value={`${formatYearMonth(
                        projectInfo.start
                    )} ~ ${formatYearMonth(projectInfo.end)}`}
                />
                <ProjectInfoItem
                    icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />}
                    label="진행 상태"
                    value={duration}
                />
                <ProjectInfoItem
                    icon={<User className="w-5 h-5 md:w-6 md:h-6" />}
                    label="책임자"
                    value={projectInfo.managerName.name}
                />
                <ProjectInfoItem
                    icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
                    label="참여인원"
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
