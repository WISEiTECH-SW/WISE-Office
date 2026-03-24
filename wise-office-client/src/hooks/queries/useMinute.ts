import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { MinutesCreateRequest } from "@/types/document";
import {
    getMinuteList,
    getMinute,
    createMinute,
    deleteMinute,
    updateMinute,
} from "@/services/minutes";
import { toastMessage } from "@/lib/common/toastMessage";
import { useReturnTargetDocStore } from "@/store/useReturnTargetDoc";

interface CreateMinuteParams {
    projectId: number;
    newMinute: MinutesCreateRequest;
}

interface DeleteMinuteParams {
    projectId: number;
    minutesId: number;
}

interface UpdateMinuteParams {
    projectId: number;
    minutesId: number;
    request: MinutesCreateRequest;
}

export const useMinutes = (projectId: number) => {
    return useQuery({
        queryKey: queryKeys.minutes(projectId),
        queryFn: () => getMinuteList(projectId),
    });
};

export const useMinuteDetail = (projectId: number, minuteId?: number) => {
    return useQuery({
        queryKey: queryKeys.minuteDetail(projectId, minuteId!),
        queryFn: () => getMinute(projectId, minuteId!),
        enabled: !!minuteId,
    });
};

export const useMinuteMutation = () => {
    const queryClient = useQueryClient();
    const { setReturnTargetDoc } = useReturnTargetDocStore();

    const invalidate = (projectId: number) =>
        queryClient.invalidateQueries({
            queryKey: queryKeys.minutes(projectId),
        });

    const createMutation = useMutation({
        mutationFn: ({ projectId, newMinute }: CreateMinuteParams) =>
            createMinute(projectId, newMinute),
        onSuccess: (data, variables) => {
            invalidate(variables.projectId);
            queryClient.invalidateQueries({
                queryKey: queryKeys.possibleAttendants(
                    variables.projectId,
                    data.minutesDate,
                ),
            });
            setReturnTargetDoc({
                type: "minute",
                id: data.minutesId,
            });
            toastMessage.successDoc("minute", "create");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ projectId, minutesId, request }: UpdateMinuteParams) =>
            updateMinute(projectId, minutesId, request),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            setReturnTargetDoc({
                type: "minute",
                id: variables.minutesId,
            });
            toastMessage.successDoc("minute", "update");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: ({ projectId, minutesId }: DeleteMinuteParams) =>
            deleteMinute(projectId, minutesId),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);

            queryClient.invalidateQueries({
                queryKey: queryKeys.approves(variables.projectId),
            });

            toastMessage.successDoc("minute", "delete");
        },
    });

    return {
        createMinute: createMutation.mutate,
        updateMinute: updateMutation.mutate,
        deleteMinute: deleteMutation.mutate,

        isMinutePending:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
    };
};
