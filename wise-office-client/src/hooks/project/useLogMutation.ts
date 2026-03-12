import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLog, patchLog, deleteLog } from "@/services/logs";
import { LogInput } from "@/types/log";
import {
    toastMessage,
    getDocumentToastMessage,
} from "@/lib/common/toastMessage";

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

export const useLogMutation = () => {
    const queryClient = useQueryClient();

    const invalidateLogs = (projectId: number) => {
        queryClient.invalidateQueries({ queryKey: ["logs", projectId] });
    };

    // CREATE
    const createMutation = useMutation({
        mutationFn: ({ projectId, logInput }: CreateLogParams) =>
            createLog(projectId, logInput),
        onSuccess: (_, variables) => {
            invalidateLogs(variables.projectId);
            toastMessage.success(getDocumentToastMessage("log", "create"));
        },
    });

    // UPDATE
    const updateMutation = useMutation({
        mutationFn: ({ projectId, logId, logInput }: UpdateLogParams) =>
            patchLog(projectId, logId, logInput),
        onSuccess: (_, variables) => {
            invalidateLogs(variables.projectId);
            toastMessage.success(getDocumentToastMessage("log", "update"));
        },
    });

    //DELETE
    const deleteMutation = useMutation({
        mutationFn: ({ projectId, logId }: DeleteLogParams) =>
            deleteLog(projectId, logId!),
        onSuccess: (_, variables) => {
            invalidateLogs(variables.projectId);
            toastMessage.success(getDocumentToastMessage("log", "delete"));
        },
    });

    return {
        createLog: createMutation.mutate,
        updateLog: updateMutation.mutate,
        deleteLog: deleteMutation.mutate,
        isLogLoading:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
    };
};
