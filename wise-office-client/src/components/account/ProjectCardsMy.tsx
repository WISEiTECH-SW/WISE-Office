import Link from "next/link";
import { Project } from "@/types/project";
import { Profile } from "@/types/profile";
import { calculateProjectDuration, formatYearMonth } from "@/lib/common/util";

interface UserProfileProps {
    props: Profile;
}
export default function ProjectCardsMy({ props }: UserProfileProps) {
    const projects = props.projectList;

    return (
        <div>
            <h2 className="text-blue-700 font-bold text-xl mb-6 border-b border-blue-200 pb-2">
                수행 중인 프로젝트
            </h2>
            <ul className="space-y-4 max-h-120 md:max-h-[500px] overflow-y-auto pt-1">
                {projects && projects.length > 0 ? (
                    projects.map((project, index) => (
                        <li key={index}>
                            <ProjectListCard project={project} />
                        </li>
                    ))
                ) : (
                    <li className="text-gray-400 py-8">
                        등록된 프로젝트가 없습니다.
                    </li>
                )}
            </ul>
        </div>
    );
}

type Props = {
    project: Project;
};

function ProjectListCard({ project }: Props) {
    const { duration, state, stateColor, textColor } = calculateProjectDuration(
        project.start,
        project.end,
    );
    return (
        <Link
            href={`/projects/${project.projectId}`}
            className="block w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
            {/* project-card-header */}
            <div className="px-6 py-3 md:px-10 md:py-7 border-b border-gray-100">
                <div className="flex justify-between items-start gap-6">
                    <p className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {project.projectTitle}
                    </p>
                    <span
                        className={`${stateColor} ${textColor} px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0`}
                    >
                        {state}
                    </span>
                </div>
            </div>

            {/* project-card-content */}
            <div className="px-6 py-3 md:px-10 md:py-7 ">
                <div className="flex flex-col md:grid md:grid-cols-5 md:grid-rows-2 gap-2 md:gap-8">
                    {/* content-left-column */}
                    <div className="col-span-2 row-span-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            프로젝트 기간
                        </span>
                        <div className="flex items-center text-sm text-gray-700 gap-3">
                            <span className="font-medium">
                                {formatYearMonth(project.start)}
                            </span>
                            <div className="w-[30%] md:w-[25%] h-px bg-gray-300"></div>
                            <span className="font-medium">
                                {formatYearMonth(project.end)}
                            </span>
                        </div>
                    </div>

                    <div className="col-start-1 col-span-2 row-start-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            현재 차수
                        </span>
                        <div className="flex items-center text-sm text-gray-700 gap-3">
                            <span className="font-medium">{duration}</span>
                        </div>
                    </div>

                    {/* content-right-column */}
                    <div className="col-start-3 col-span-3 row-start-1 space-y-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            프로젝트 매니저
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 font-medium">
                                {project.managerName}
                            </span>
                        </div>
                    </div>

                    <div className="col-start-3 col-span-3 row-start-2 space-y-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            참여 인원
                        </span>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-700 font-medium">
                            {(project.attendant ?? []).join(
                                "\u00A0\u00A0\u00A0",
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Effect Indicator */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
    );
}
