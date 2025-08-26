import Link from "next/link";
import { Project } from "@/types/project";
import { Profile } from "@/types/profile";
import { calculateProjectDuration } from "@/lib/common/util";
interface UserProfileProps{
    props:Profile;
}
export default function ProjectCardsMy({props}:UserProfileProps) {
    const projects = props.projectList;

    return (
        <div>
            <h2 className="text-blue-700 font-bold text-xl mb-6 border-b border-blue-200 pb-2">
                수행 중인 프로젝트
            </h2>
            <ul className="space-y-4 max-h-[350px] overflow-y-auto">
                {projects && projects.length > 0 ? (
                    projects.map((project, index) => (
                        <li key={index}>
                            <ProjectListCard project={project} />
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">
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
            project.end
        );
    return (
        <Link
            href={`/projects/${project.projectId}`}
            className="block w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
            {/* project-card-header */}
            <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h5 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.projectTitle}
                        </h5>
                    </div>
                    <span
                        className={`${stateColor} ${textColor} px-2 py-0.5 rounded-full text-xs font-semibold`}
                    >
                        {state}
                    </span>
                </div>
            </div>

            {/* project-card-content */}
            <div className="px-5 py-2">
                <div className="grid grid-cols-5 gap-4">
                    {/* content-left-column */}
                    <div className="col-span-2 space-y-2">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                프로젝트 기간
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-700">
                                <span className="font-medium">
                                    {project.start}
                                </span>
                                <div className="w-[15%] h-px bg-gray-300"></div>
                                <span className="font-medium">
                                    {project.end}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                현재 차수
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-700">
                                <span className="font-medium">{duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* content-right-column */}
                    <div className="col-span-3 space-y-2">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                프로젝트 매니저
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700 font-medium">
                                    {project.managerName}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    참여 인원
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {(project.attendant ?? []).map((name, i) => (
                                    <span
                                        key={`${name}-${i}`}
                                        className="text-xs text-gray-700 font-medium"
                                    >
                                        {name}
                                    </span>
                                ))}

                                {(!project.attendant ||
                                    project.attendant.length === 0) && (
                                    <span className="text-xs text-gray-400 font-medium">
                                        -
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Effect Indicator */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
    );
}
