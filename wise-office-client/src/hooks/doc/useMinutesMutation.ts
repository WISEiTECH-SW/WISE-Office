import {
    getDocumentToastMessage,
    toastMessage,
} from "@/lib/common/toastMessage";
import {
    createMinute,
    deleteMinute,
    updateMinute,
} from "@/services/minutes";
import { MinutesCreateRequest } from "@/types/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateMinuteParams = {
    projectId: number;
    newMinute: MinutesCreateRequest;
};

type DeleteMinuteParams = {
    projectId: number;
    minutesId: number;
};

type UpdateMinuteParams = {
    projectId: number;
    minutesId: number;
    request: MinutesCreateRequest;
};

export const useMinutesMutation = () => {
    const queryClient = useQueryClient();

    const invalidateMinutes = (projectId: number) => {
        queryClient.invalidateQueries({ queryKey: ["minutes", projectId] });
    };

    const invalidateApproves = (projectId: number) => {
        queryClient.invalidateQueries({ queryKey: ["approves", projectId] });
    };

    const invalidateApproveDetail = (projectId: number) => {
        queryClient.invalidateQueries({
            queryKey: ["approveDetail", projectId],
        });
    };

    //CREATE
    const createMinuteMutation = useMutation({
        mutationFn: ({ projectId, newMinute }: CreateMinuteParams) =>
            createMinute(projectId, newMinute),
        onSuccess: (_, variables) => {
            invalidateMinutes(variables.projectId);
            toastMessage.success(getDocumentToastMessage("minute", "create"));
        },
    });

    //UPDATE
    const updateMinuteMutation = useMutation({
        mutationFn: ({ projectId, minutesId, request }: UpdateMinuteParams) =>
            updateMinute(projectId, minutesId, request),
        onSuccess: (_, variables) => {
            invalidateMinutes(variables.projectId);
            invalidateApproves(variables.projectId);
            invalidateApproveDetail(variables.projectId);
            queryClient.invalidateQueries({
                queryKey: ["minutes", variables.projectId, variables.minutesId],
            });
            toastMessage.success(getDocumentToastMessage("minute", "update"));
        },
        onError: () => {
            toastMessage.error("회의록 수정에 실패했습니다.");
        },
    });

    //DELETE
    const deleteMinuteMutation = useMutation({
        mutationFn: ({ projectId, minutesId }: DeleteMinuteParams) =>
            deleteMinute(projectId, minutesId),
        onSuccess: (_, variables) => {
            invalidateMinutes(variables.projectId);
            invalidateApproves(variables.projectId);
            invalidateApproveDetail(variables.projectId);
            queryClient.removeQueries({
                queryKey: ["minutes", variables.projectId, variables.minutesId],
            });
            toastMessage.success(getDocumentToastMessage("minute", "delete"));
        },
        onError: () => {
            toastMessage.error("회의록 삭제에 실패했습니다.");
        },
    });

    return {
        createMinute: createMinuteMutation.mutate,
        updateMinute: updateMinuteMutation.mutate,
        deleteMinute: deleteMinuteMutation.mutate,
        isMinuteLoading:
            createMinuteMutation.isPending || updateMinuteMutation.isPending,
        isMinuteUpdating: updateMinuteMutation.isPending,
        isMinuteDeleting: deleteMinuteMutation.isPending,
    };
};
