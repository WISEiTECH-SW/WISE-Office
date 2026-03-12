import { create } from "zustand";
import { ProjectGroupByYear } from "@/types/project";
import { getProjectsGroupByYear } from "@/services/projects";

type ProjectInfo = {
    projectId: number;
    projectTitle: string;
};

type OverviewState = {
    optionIndex: number;
    year: number;
    month: number;
    projectInfo: ProjectInfo;

    setOptionIndex: (optionIndex: number) => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    setProjectInfo: (projectInfo: ProjectInfo) => void;
};

export const useOverviewStore = create<OverviewState>((set) => ({
    optionIndex: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    projectInfo: { projectId: 0, projectTitle: "" },

    setOptionIndex: (optionIndex) => set({ optionIndex }),
    setYear: (year) => set({ year }),
    setMonth: (month) => set({ month }),
    setProjectInfo: (projectInfo: ProjectInfo) => set({ projectInfo }),
}));

// 연도별 프로젝트 메뉴
interface ProjectGroupByYearState {
    groupByYear: ProjectGroupByYear[];
    fetchGroupByYear: () => Promise<void>;
}

export const useProjectsGroupByYearStore = create<ProjectGroupByYearState>(
    (set) => ({
        groupByYear: [],

        fetchGroupByYear: async () => {
            const data = await getProjectsGroupByYear();
            const currentYear = new Date().getFullYear();

            const filtered = Array.isArray(data)
                ? data.filter((item) => item.year <= currentYear)
                : [];

            set({ groupByYear: filtered });

            if (filtered.length === 0) return;

            const yearGroup = filtered.find(
                (item) => item.year === currentYear,
            );
            if (!yearGroup || yearGroup.projects.length === 0) return;

            // 해당 연도의 최소 projectId
            const maxProjectId = Math.min(
                ...yearGroup.projects.map((p) => p.projectId),
            );

            const currentProjectInfo = useOverviewStore.getState().projectInfo;
            useOverviewStore.setState({
                year: currentYear,
                projectInfo: {
                    ...currentProjectInfo,
                    projectId: maxProjectId,
                },
            });
        },
    }),
);

// 미리보기 모달 상태
type PreviewState = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;

    onOpen: () => void;
    onClose: () => void;
};

export const usePreviewStore = create<PreviewState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),

    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
