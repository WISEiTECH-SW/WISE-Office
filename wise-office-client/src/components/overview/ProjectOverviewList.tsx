import { useEffect, useState } from "react";
import OverviewCard from "./OverviewCard";
import { useOverviewStore } from "@/store/useOverviewStore";
import {
    getApproveInfo,
    getApprovesAll,
    getMinutesAll,
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
    const [docDetailList, setDocDetailList] = useState<{
        minutesDetail: Map<number, MinutesInfo>;
        approvalDetail: Map<number, ApprovalDetailResponse>;
    }>({
        minutesDetail: new Map(),
        approvalDetail: new Map(),
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [minutesList, approvalList] = await Promise.all([
                getMinutesAll(projectInfo.projectId),
                getApprovesAll(projectInfo.projectId),
            ]);

            setMinutesList(minutesList);

            const [minutesDetailResponse, approvalDetailResponse] =
                await Promise.all([
                    Promise.all(
                        minutesList.map((minutes) =>
                            getMinutesInfo(
                                projectInfo.projectId,
                                minutes.minutesId,
                            ),
                        ),
                    ),
                    Promise.all(
                        approvalList.map((approval) =>
                            getApproveInfo(
                                projectInfo.projectId,
                                approval.approveId,
                            ),
                        ),
                    ),
                ]);

            setDocDetailList({
                minutesDetail: new Map(
                    minutesDetailResponse.map((minutes) => [
                        minutes.minutesId,
                        minutes,
                    ]),
                ),
                approvalDetail: new Map(
                    approvalDetailResponse.map((approval) => [
                        approval.approveId,
                        approval,
                    ]),
                ),
            });
        };

        if (projectInfo.projectId) {
            setIsLoading(true);

            fetchData().finally(() => setIsLoading(false));
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
                                const minutesDetail =
                                    docDetailList.minutesDetail.get(
                                        info.minutesId,
                                    );
                                const approvalDetail =
                                    docDetailList.approvalDetail.get(
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
