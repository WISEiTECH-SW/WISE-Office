import { useEffect, useState } from "react";
import OverviewCard from "./OverviewCard";
import { useOverviewStore } from "@/store/useOverviewStore";
import {
    getApproveInfo,
    getApproves,
    getMinutes,
    getMinutesInfo,
} from "@/services/overview";
import {
    ApprovalDetailResponse,
    MinutesInfo,
    MinutesList,
} from "@/types/document";
import LoadingIndicator from "../ui/LoadingIndicator";

export default function ProjectOverviewList() {
    const { year, projectInfo } = useOverviewStore();
    const [minutesList, setMinutesList] = useState<MinutesList>([]);
    const [minutesDetailList, setMinutesDetailList] = useState<MinutesInfo[]>(
        [],
    );
    const [approvalDetailList, setApprovalDetailList] = useState<
        ApprovalDetailResponse[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMinutes = async () => {
            const data = await getMinutes(projectInfo.projectId);
            setMinutesList(data);

            const minutesDetailResponse = await Promise.all(
                data.map((m) =>
                    getMinutesInfo(projectInfo.projectId, m.minutesId),
                ),
            );

            setMinutesDetailList(minutesDetailResponse);
        };

        const fetchApproves = async () => {
            const data = await getApproves(projectInfo.projectId);

            const approvalDetailResponse = await Promise.all(
                data.map((m) =>
                    getApproveInfo(projectInfo.projectId, m.approveId),
                ),
            );

            setApprovalDetailList(approvalDetailResponse);
        };

        if (projectInfo.projectId) {
            setIsLoading(true);

            Promise.all([fetchMinutes(), fetchApproves()]).finally(() =>
                setIsLoading(false),
            );
        }
    }, [projectInfo.projectId]);

    const filteredData =
        minutesList?.filter(
            (m) => new Date(m.minutesAt).getFullYear() === year,
        ) ?? [];

    const groupedByMonth = Array.from({ length: 12 }, (_, i) => {
        const month = i;

        const minutesInfo = filteredData
            .filter((m) => new Date(m.minutesAt).getMonth() === month)
            .sort(
                (a, b) =>
                    new Date(a.minutesAt).getTime() -
                    new Date(b.minutesAt).getTime(),
            );

        return {
            month: month + 1,
            minutesInfo,
        };
    }).filter((m) => m.minutesInfo.length > 0);

    return (
        <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold">{projectInfo.projectTitle}</p>

            {isLoading ? (
                <div className="-translate-y-30">
                    <LoadingIndicator type="minutes" />
                </div>
            ) : !minutesList.length ? (
                <p className="text-gray-400">등록된 문서가 없습니다.</p>
            ) : (
                groupedByMonth
                    .sort((a, b) => b.month - a.month)
                    .map(({ month, minutesInfo }) => (
                        <div key={month} className="flex flex-col gap-4 pr-16">
                            <p className="text-lg font-semibold">{month}월</p>
                            {minutesInfo.map((info) => {
                                const minutesDetail = minutesDetailList.find(
                                    (minutesDetail) =>
                                        minutesDetail.minutesId ===
                                        info.minutesId,
                                );
                                const approvalDetail = approvalDetailList.find(
                                    (approvalDetail) =>
                                        approvalDetail.minutesId ===
                                        info.minutesId,
                                );

                                return (
                                    <div
                                        key={info.minutesId}
                                        className="flex flex-col gap-3"
                                    >
                                        <OverviewCard
                                            minutesTitle={info.title}
                                            minutesDetail={minutesDetail}
                                            approvalDetail={approvalDetail}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))
            )}
        </div>
    );
}
