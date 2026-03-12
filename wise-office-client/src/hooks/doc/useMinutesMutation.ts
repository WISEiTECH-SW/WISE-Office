import {
    getDocumentToastMessage,
    toastMessage,
} from "@/lib/common/toastMessage";
import { createMinute } from "@/services/minutes";
import { MinutesCreateRequest } from "@/types/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateMinuteParams = {
    projectId: number;
    newMinute: MinutesCreateRequest;
};

export const useMinutesMutation = () => {
    const queryClient = useQueryClient();

    const invalidateMinutes = (projectId: number) => {
        queryClient.invalidateQueries({ queryKey: ["minutes", projectId] });
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

    //DELETE

    return {
        createMinute: createMinuteMutation.mutate,
        isMinuteLoading: createMinuteMutation.isPending,
    };
};
