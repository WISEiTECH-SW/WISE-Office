import { useEffect } from "react";
import { useState } from "react";
import ProjectListCard from "@/components/ProjectListCard";
import AddProjectButton from "@/components/AddProjectButton";
import { getProjects } from "@/services/projects";
import { useProjects } from "@/store/useProjects";
import ProjectCreateModal from "./project_modal";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
    const projects = useProjects((s) => s.projects);
    const { hasToken } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getProjects();
                // Zustand store에 저장
                useProjects.setState({
                    projects: Array.isArray(data) ? data : [],
                });
            } catch (err) {
                console.error("프로젝트 조회 실패:", err);
                useProjects.setState({ projects: [] });
            }
        })();
    }, [projects]);

    return (
        <section className="mt-20 mb-30 px-12 py-5 px-70">
            <h2 className="text-3xl font-bold mb-2 text-left">
                프로젝트 진행 현황
            </h2>

            {hasToken && (
                <>
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="flex justify-end mb-10"
                    >
                        <AddProjectButton />
                    </div>
                    {isModalOpen && (
                        <ProjectCreateModal
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                </>
            )}

            <div className="flex flex-col mt-10 items-center w-full gap-10 text-gray-600">
                {projects.length === 0 ? (
                    <p className="text-gray-400 py-8">
                        등록된 프로젝트가 없습니다.
                    </p>
                ) : (
                    projects.map((p) => (
                        <ProjectListCard key={p.projectId} project={p} />
                    ))
                )}
            </div>
        </section>
    );
}
