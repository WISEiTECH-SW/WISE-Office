import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuthStore } from "@/store/useAuthStore";
import { useReturnTargetDocStore } from "@/store/useReturnTargetDoc";
import { useProjectPages } from "@/hooks/queries";

import {
    ProjectProgressHeader,
    ProjectListCard,
    Pagenation,
} from "@/components/main";
import ProjectModal from "@/components/modal/ProjectModal/ProjectModal";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import ErrorIndicator from "@/components/ui/ErrorIndicator";
import { usePageStore } from "@/store/usePageStore";

export default function Home() {
    const router = useRouter();
    const { hasToken } = useAuthStore();
    const { clearReturnTargetDoc } = useReturnTargetDocStore();
    const { currentPage, setProjectPage } = usePageStore();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    /* ----- query ----- */
    const { data, isLoading } = useProjectPages(currentPage);

    /* ----- hook ----- */
    useEffect(() => {
        clearReturnTargetDoc();
    }, [clearReturnTargetDoc]);

    /* ----- func ----- */
    const movePage = (page: number) => {
        if (!data) return;
        if (page < 1 || page > data.pageNationInfo.totalPages) return;
        setProjectPage(page);
    };

    const goToProjectDetail = (projectId: number) => {
        router.push(`/projects/${projectId}`);
    };

    /* ----- page ----- */
    if (isLoading) return <LoadingIndicator type="main" />;
    if (!data) return <ErrorIndicator />;

    return (
        <section className="flex flex-col items-center gap-6 md:gap-10 max-w-screen-lg mx-auto my-10 md:my-20 px-2">
            <ProjectProgressHeader
                totalCount={data.pageNationInfo.totalCount}
                isLoggedIn={hasToken}
                onClick={() => setIsModalOpen(true)}
            />

            <div className="flex flex-col w-full gap-6">
                {data.pageNationInfo.totalCount === 0 ? (
                    <p className="text-2xl text-center font-bold text-gray-400 py-12">
                        등록된 프로젝트가 없습니다.
                    </p>
                ) : (
                    data.projectListResponses.map((project) => (
                        <ProjectListCard
                            key={project.projectId}
                            project={project}
                            onClick={() => goToProjectDetail(project.projectId)}
                        />
                    ))
                )}
            </div>

            {/* 페이지네이션 */}
            <Pagenation
                pageInfo={data.pageNationInfo}
                onPageChange={movePage}
            />

            {/* 작성 모달 */}
            {isModalOpen && (
                <ProjectModal onClose={() => setIsModalOpen(false)} />
            )}
        </section>
    );
}
