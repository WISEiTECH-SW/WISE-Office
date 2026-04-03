import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { ApproveUpdateRequest } from "@/types/document";
import {
    getApproveDetail,
    getApproveList,
    createApprove,
    updateApprove,
} from "@/services/approves";
import { toastMessage } from "@/lib/common/toastMessage";
import { useReturnTargetDocStore } from "@/store/useReturnTargetDoc";

interface CreateApproveParams {
    projectId: number;
    minutesId: number;
}

interface UpdateApproveParams {
    projectId: number;
    approveId: number;
    request: ApproveUpdateRequest;
}

export const useApproves = (projectId: number, page: number) => {
    return useQuery({
        queryKey: ["approves", projectId, page],
        queryFn: () => getApproveList(projectId, page),
        placeholderData: keepPreviousData,
    });
};

export const useApproveDetail = (projectId: number, approveId?: number) => {
    return useQuery({
        queryKey: queryKeys.approveDetail(projectId, approveId!),
        queryFn: () => getApproveDetail(projectId, approveId!),
        enabled: !!approveId,
    });
};

export const useApproveMutation = () => {
    const queryClient = useQueryClient();
    const { setReturnTargetDoc } = useReturnTargetDocStore();

    const invalidate = (projectId: number) =>
        queryClient.invalidateQueries({
            queryKey: queryKeys.approves(projectId),
        });

    const createMutation = useMutation({
        mutationFn: ({ projectId, minutesId }: CreateApproveParams) =>
            createApprove(projectId, minutesId),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            queryClient.invalidateQueries({
                queryKey: queryKeys.minuteDetail(
                    variables.projectId,
                    variables.minutesId,
                ),
            });
            toastMessage.successDoc("approve", "create");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ projectId, approveId, request }: UpdateApproveParams) =>
            updateApprove(projectId, approveId, request),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            setReturnTargetDoc({ type: "approve", id: variables.approveId });
            toastMessage.successDoc("approve", "update");
        },
    });

    return {
        createApprove: createMutation.mutate,
        updateApprove: updateMutation.mutate,

        isApprovePending: createMutation.isPending || updateMutation.isPending,
    };
};
