import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLog, patchLog, deleteLog } from "@/services/logs";
import { LogInput } from "@/types/log";

export const useLogMutation = (projectId: number, logId: number | null) => {
    const queryClient = useQueryClient();

    // CREATE
    const createMutation = useMutation({
        mutationFn: (data: LogInput) => createLog(projectId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logs", projectId] });
        },
    });

    // UPDATE
    const updateMutation = useMutation({
        mutationFn: (data: LogInput) => patchLog(projectId, logId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["logs", projectId],
            });
            queryClient.invalidateQueries({
                queryKey: ["log", logId],
            });
        },
    });

    //DELETE
    const deleteMutation = useMutation({
        mutationFn: () => deleteLog(projectId, logId!),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["logs", projectId],
            });
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
