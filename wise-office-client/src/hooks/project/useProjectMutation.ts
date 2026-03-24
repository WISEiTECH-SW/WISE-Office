import { toastMessage } from "@/lib/common/toastMessage";
import { deleteProject, postProject, updateProject } from "@/services/projects";
import { CreateProject } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useProjects } from "@/store/useProjects";
export const useProjectMutation = () => {
    const queryClient = useQueryClient();
    const fetchProjects = useProjects((s) => s.fetchProjects);
    const router = useRouter();
    //CREATE
    const createMutation = useMutation({
        mutationFn: (projectData: CreateProject) => postProject(projectData),
        onSuccess: async () => {
            await fetchProjects({
                currentPage: 1,
                offset: 6,
            });

            toastMessage.success("프로젝트가 등록되었습니다.");
            router.push("/");
        },
        onError: () => {
            toastMessage.error("프로젝트 등록에 실패했습니다.");
        },
    });

    // UPDATE
    const updateMutation = useMutation({
        mutationFn: ({
            projectData,
            projectId,
        }: {
            projectData: CreateProject;
            projectId: number;
        }) => updateProject(projectData, projectId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["project", variables.projectId],
            });
            toastMessage.success("프로젝트가 수정되었습니다.");
        },
        onError: () => {
            toastMessage.error("프로젝트 수정에 실패했습니다.");
        },
    });

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: (projectId: number) => deleteProject(projectId),
        onSuccess: (projectId: number) => {
            queryClient.invalidateQueries({
                queryKey: ["project", projectId],
            });

            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });

            toastMessage.success("프로젝트가 삭제되었습니다.");
            router.push("/");
        },
        onError: () => {
            toastMessage.error("프로젝트 삭제에 실패했습니다.");
        },
    });
    return {
        createProject: createMutation.mutate,
        updateProject: updateMutation.mutate,
        deleteProject: deleteMutation.mutate,
        isUpdating:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
    };
};
