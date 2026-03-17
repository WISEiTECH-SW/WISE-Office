import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { getLogList } from "@/services/logs";
import { getProjectById } from "@/services/projects";
import { getMinuteList } from "@/services/minutes";
import {
    createApprove,
    getApproveDetail,
    getApproveList,
    getPossibleAttendantsList,
    updateApprove,
} from "@/services/documents";

import { ApproveCreateResonse, ApproveUpdateRequest } from "@/types/document";

/** 프로젝트 상세 조회 */
export const useProjectDetail = (projectId: number) =>
    useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId),
    });

/** 회의록 참여자별 가능여부 조회 */
export const usePossibleAttendantsList = (
    projectId: number,
    minutesDate: string,
) =>
    useQuery({
        queryKey: ["possibleAttendants", projectId, minutesDate],
        queryFn: () => getPossibleAttendantsList(projectId, minutesDate),
        enabled: !!projectId && !!minutesDate,
    });

/** 프로젝트 문서 목록 (로그 / 회의록) */
export const useDocumentLists = (projectId: number) => {
    const logs = useQuery({
        queryKey: ["logs", projectId],
        queryFn: () => getLogList(projectId),
    });

    const minutes = useQuery({
        queryKey: ["minutes", projectId],
        queryFn: () => getMinuteList(projectId),
    });

    const approves = useQuery({
        queryKey: ["approves", projectId],
        queryFn: () => getApproveList(projectId),
    });

    return { logs, minutes, approves };
};

/** 품의서 생성 */
type ApproveCreationParams = {
    projectId: number;
    minutesId: number;
};
export const useApproveCreation = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: ({ projectId, minutesId }: ApproveCreationParams) =>
            createApprove(projectId, minutesId),

        onSuccess: (data: ApproveCreateResonse, variables) => {
            router.push(
                `/projects/${variables.projectId}/documents/approve/${data.approveId}`,
            );
        },
    });
};

/** 품의서 상세 조회 */
export const useApproveDetail = (projectId?: number, approveId?: number) =>
    useQuery({
        queryKey: ["approveDetail", projectId, approveId],
        queryFn: () => getApproveDetail(projectId!, approveId!),
        enabled: !!projectId && !!approveId,
    });

/** 품의서 수정 */
export const useApproveUpdate = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ({
            projectId,
            approveId,
            request,
        }: {
            projectId: number;
            approveId: number;
            request: ApproveUpdateRequest;
        }) => updateApprove(projectId, approveId, request),

        onSuccess: (_, variables) => {
            const { projectId, approveId } = variables;

            queryClient.invalidateQueries({
                queryKey: ["approveDetail", projectId, approveId],
            });

            router.push({
                pathname: `/projects/${projectId}`,
                query: {
                    type: "approve",
                    docId: approveId,
                },
            });
        },
    });
};
