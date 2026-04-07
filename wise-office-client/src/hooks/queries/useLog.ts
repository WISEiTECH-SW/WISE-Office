import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { LogInput } from "@/types/log";
import {
    getLogDetail,
    getLogList,
    createLog,
    patchLog,
    deleteLog,
} from "@/services/logs";
import { toastMessage } from "@/lib/common/toastMessage";

interface CreateLogParams {
    projectId: number;
    logInput: LogInput;
}

interface UpdateLogParams {
    projectId: number;
    logId: number;
    logInput: LogInput;
}

interface DeleteLogParams {
    projectId: number;
    logId: number;
}

export const useLogs = (projectId: number, page: number) => {
    return useQuery({
        queryKey: ["logs", projectId, page],
        queryFn: () => getLogList(projectId, page),
        placeholderData: keepPreviousData,
    });
};

export const useLogDetail = (projectId: number, logId?: number) => {
    return useQuery({
        queryKey: queryKeys.logDetail(projectId, logId!),
        queryFn: () => getLogDetail(projectId, logId!),
        enabled: !!logId,
    });
};

export const useLogMutation = () => {
    const queryClient = useQueryClient();

    const invalidate = (projectId: number) =>
        queryClient.invalidateQueries({ queryKey: queryKeys.logs(projectId) });

    const createMutation = useMutation({
        mutationFn: ({ projectId, logInput }: CreateLogParams) =>
            createLog(projectId, logInput),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            toastMessage.successDoc("log", "create");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ projectId, logId, logInput }: UpdateLogParams) =>
            patchLog(projectId, logId, logInput),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            toastMessage.successDoc("log", "update");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: ({ projectId, logId }: DeleteLogParams) =>
            deleteLog(projectId, logId),
        onSuccess: (_, variables) => {
            invalidate(variables.projectId);
            toastMessage.successDoc("log", "delete");
        },
    });

    return {
        createLog: createMutation.mutate,
        updateLog: updateMutation.mutate,
        deleteLog: deleteMutation.mutate,

        isLogPending:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
    };
};
