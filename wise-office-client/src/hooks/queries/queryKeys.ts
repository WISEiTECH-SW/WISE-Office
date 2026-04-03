// import { PageParams } from "@/types/page";

export const queryKeys = {
    all: ["projects"] as const,

    // 사용자
    members: () => [...queryKeys.all, "members"] as const,

    // 프로젝트
    projectPages: (page: number) => [...queryKeys.all, "pages", page] as const,
    projectDetail: (projectId: number) =>
        [...queryKeys.all, projectId] as const,

    // 로그
    logs: (projectId: number) =>
        [...queryKeys.projectDetail(projectId), "logs"] as const,
    logDetail: (projectId: number, logId: number) =>
        [...queryKeys.logs(projectId), logId] as const,

    // 댓글
    comments: (projectId: number, logId: number) =>
        [...queryKeys.logDetail(projectId, logId), "comments"] as const,

    // 회의록
    minutes: (projectId: number) =>
        [...queryKeys.projectDetail(projectId), "minutes"] as const,
    minuteDetail: (projectId: number, minuteId: number) =>
        [...queryKeys.minutes(projectId), minuteId] as const,

    //품의서
    approves: (projectId: number) =>
        [...queryKeys.projectDetail(projectId), "approves"] as const,
    approveDetail: (projectId: number, approveId: number) =>
        [...queryKeys.approves(projectId), approveId] as const,

    //참여자
    possibleAttendants: (projectId: number, minutesDate?: string) =>
        [
            ...queryKeys.projectDetail(projectId),
            "possibleAttendants",
            minutesDate,
        ] as const,
};
