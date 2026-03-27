import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuthStore } from "@/store/useAuthStore";
import { useProjects } from "@/store/useProjects";
import { useReturnTargetDocStore } from "@/store/useReturnTargetDoc";

import {
    ProjectProgressHeader,
    ProjectListCard,
    PagenationButton,
} from "@/components/main";
import ProjectModal from "@/components/modal/ProjectModal/ProjectModal";

export default function Home() {
    const projects = useProjects((s) => s.projects);
    const fetchProjects = useProjects((s) => s.fetchProjects);
    const totalCount = useProjects((s) => s.totalCount);
    const totalPages = useProjects((s) => s.totalPages);
    const { hasToken } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const offset = 6;
    const { clearReturnTargetDoc } = useReturnTargetDocStore();

    const router = useRouter();

    /* ----- hook ----- */
    useEffect(() => {
        clearReturnTargetDoc();
    }, [clearReturnTargetDoc]);

    useEffect(() => {
        (async () => {
            try {
                fetchProjects({
                    currentPage,
                    offset,
                });
            } catch (err) {
                console.error("프로젝트 조회 실패:", err);
            }
        })();
    }, [currentPage, fetchProjects]);

    /* ----- func ----- */
    const movePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const goToProjectDetail = (projectId: number) => {
        router.push(`/projects/${projectId}`);
    };

    return (
        <section className="flex flex-col items-center gap-6 max-w-screen-lg mx-auto my-6">
            <ProjectProgressHeader
                totalCount={totalCount}
                isLogedIn={hasToken}
                onClick={() => setIsModalOpen(true)}
            />

            <div className="flex flex-col w-full gap-6">
                {totalCount === 0 ? (
                    <p className="text-2xl text-center font-bold text-gray-400 py-12">
                        등록된 프로젝트가 없습니다.
                    </p>
                ) : (
                    projects.map((project) => (
                        <ProjectListCard
                            key={project.projectId}
                            project={project}
                            onClick={() => goToProjectDetail(project.projectId)}
                        />
                    ))
                )}
            </div>

            {/* 페이지네이션 */}
            <nav className="flex gap-4" aria-label="Pagination">
                <PagenationButton
                    label="첫 페이지"
                    isNumber={false}
                    onClick={() => movePage(1)}
                    isDisabled={currentPage === 1}
                />

                {/* 페이지 번호 */}
                <ul className="flex items-center gap-2">
                    {(() => {
                        const pages: (number | string)[] = [];
                        const sibling = 2; // 현재 페이지 양옆 2개까지

                        if (totalPages <= 5) {
                            // 전체 페이지가 5 이하 : 전부 표시
                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else if (currentPage < 4) {
                            // 현재 페이지가 3페이지 이전 : 앞에서 5개
                            for (let i = 1; i <= 5; i++) pages.push(i);
                        } else if (currentPage > totalPages - 3) {
                            // 현재 페이지가 끝에서 3페이지 이상 : 마지막 5개
                            for (let i = totalPages - 4; i <= totalPages; i++)
                                pages.push(i);
                        } else {
                            // 현재 페이지 기준 2페이지씩
                            const start = currentPage - sibling;
                            const end = currentPage + sibling;
                            for (let i = start; i <= end; i++) pages.push(i);
                        }

                        return pages.map((page) => (
                            <li key={page}>
                                <PagenationButton
                                    label={page}
                                    isNumber={true}
                                    onClick={() => movePage(page as number)}
                                    isSelected={currentPage === page}
                                />
                            </li>
                        ));
                    })()}
                </ul>
                <PagenationButton
                    label="끝 페이지"
                    isNumber={false}
                    onClick={() => movePage(totalPages)}
                    isDisabled={currentPage === totalPages}
                />
            </nav>

            {/* 작성 모달 */}
            {isModalOpen && (
                <ProjectModal
                    mode={"create"}
                    onClose={() => setIsModalOpen(false)}
                    onCreated={async () => {
                        await fetchProjects({
                            currentPage,
                            offset,
                        });
                        setCurrentPage(1);
                    }}
                />
            )}
        </section>
    );
}
