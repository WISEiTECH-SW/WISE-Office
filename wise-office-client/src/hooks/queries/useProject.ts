import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

import { CreateProject } from "@/types/project";
import { PageParams } from "@/types/page";

import {
    getProjectById,
    postProject,
    updateProject,
    deleteProject,
    getCurrentPageProjects,
} from "@/services/projects";
import { toastMessage } from "@/lib/common/toastMessage";

interface UpdateProjectParams {
    data: CreateProject;
    projectId: number;
}

export const useProjectsPaged = (params: PageParams) => {
    return useQuery({
        queryKey: queryKeys.projectsPaged(params),
        queryFn: () => getCurrentPageProjects(params),
        enabled: !!params,
    });
};

export const useProjectDetail = (projectId?: number) => {
    return useQuery({
        queryKey: queryKeys.projectDetail(projectId!),
        queryFn: () => getProjectById(projectId!),
        enabled: !!projectId,
    });
};

export const useProjectMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateProject) => postProject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            toastMessage.successDoc("project", "create");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ data, projectId }: UpdateProjectParams) =>
            updateProject(data, projectId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.projectDetail(variables.projectId),
            });
            toastMessage.successDoc("project", "update");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (projectId: number) => deleteProject(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
            toastMessage.successDoc("project", "delete");
        },
    });

    return {
        createProject: createMutation.mutate,
        updateProject: updateMutation.mutate,
        deleteProject: deleteMutation.mutate,

        isProjectPending:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
    };
};
