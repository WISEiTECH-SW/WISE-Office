import AddProjectButton from "@/components/AddProjectButton";
import ProjectListCard from "@/components/ProjectListCard";
import { getCurrentPageProjects } from "@/services/projects";
import { useAuthStore } from "@/store/useAuthStore";
import { useProjects } from "@/store/useProjects";
import { useEffect, useState } from "react";
import ProjectCreateModal from "../components/project/project_modal";

export default function Home() {
    const projects = useProjects((s) => s.projects);
    const fetchProjects = useProjects((s) => s.fetchProjects);
    const { hasToken } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const offset = 6;

    useEffect(() => {
        (async () => {
            try {
                const data = await getCurrentPageProjects({
                    currentPage,
                    offset,
                });

                useProjects.setState({
                    projects: Array.isArray(data.projectListResponses)
                        ? data.projectListResponses
                        : [],
                });

                setCurrentPage(data.pageNationInfo.currentPage);
                setTotalPages(data.pageNationInfo.totalPages);
                setTotalCount(data.pageNationInfo.totalCount);
            } catch (err) {
                console.error("프로젝트 조회 실패:", err);
            }
        })();
    }, [currentPage, fetchProjects]);

    const movePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <section className="flex flex-col items-center  gap-4 md:gap-10 max-w-screen-lg mx-auto my-10 md:my-20 px-2">
            <div className="flex flex-col w-full">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-left">
                        프로젝트 진행 현황
                    </h2>
                    <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        {totalCount > 0 && (
                            <span>
                                {" "}
                                현재{" "}
                                <b className="text-slate-900">{totalCount}</b>개
                                프로젝트 진행중
                            </span>
                        )}
                    </span>
                </div>

                {hasToken && (
                    <>
                        <div className="flex justify-end">
                            <AddProjectButton
                                modalOpen={() => setIsModalOpen(true)}
                            />
                        </div>
                        {isModalOpen && (
                            <ProjectCreateModal
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
                    </>
                )}
            </div>
            <div className="flex flex-col items-center w-full gap-10 text-gray-600">
                {projects.length === 0 ? (
                    <p className="text-gray-400 py-8">
                        등록된 프로젝트가 없습니다.
                    </p>
                ) : (
                    // currentPageProjects.map((p) => (
                    projects.map((p) => (
                        <ProjectListCard key={p.projectId} project={p} />
                    ))
                )}
            </div>

            {/* 페이지네이션 */}
            <nav
                className="flex gap-6 items-center mt-10"
                aria-label="Pagination"
            >
                <button
                    onClick={() => movePage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer disabled:opacity-0 disabled:cursor-default"
                >
                    첫 페이지
                </button>

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
                                <button
                                    onClick={() => movePage(page as number)}
                                    className={`px-3 py-1 text-sm rounded-md border cursor-pointer ${currentPage === page
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                                        }`}
                                >
                                    {page}
                                </button>
                            </li>
                        ));
                    })()}
                </ul>

                <button
                    onClick={() => movePage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer disabled:opacity-0 disabled:cursor-default"
                >
                    끝 페이지
                </button>
            </nav>
        </section>
    );
}
