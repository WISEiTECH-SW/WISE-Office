import ProjectListCard from "../ProjectListCard";
export default function ProjectCardsMy(props) {
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
                    <li className="text-gray-500">등록된 프로젝트가 없습니다.</li>
                )}
            </ul>
        </div>
    );
}