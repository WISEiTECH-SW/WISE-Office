import { useEffect, useState } from "react";
import { useOverviewStore } from "@/store/useOverviewStore";
import {
    getApproveInfo,
    getApproves,
    getMinutes,
    getMinutesInfo,
    getMonthlyDocuments,
} from "@/services/overview";
import {
    ApprovalDetailResponse,
    MinutesInfo,
    MonthlyDocument,
} from "@/types/document";
import OverviewCard from "./OverviewCard";
import LoadingIndicator from "../ui/LoadingIndicator";

export default function MonthOverviewList() {
    const { year, month } = useOverviewStore();
    const [monthlyDocumentList, setMonthlyDocumentList] = useState<
        MonthlyDocument[]
    >([]);
    const [minutesDetailList, setMinutesDetailList] = useState<MinutesInfo[]>(
        [],
    );
    const [approvalDetailList, setApprovalDetailList] = useState<
        ApprovalDetailResponse[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMinutes = async (projectIds: number[]) => {
            const allDetails = await Promise.all(
                projectIds.map(async (projectId) => {
                    const data = await getMinutes(projectId);
                    return Promise.all(
                        data.map((m) => getMinutesInfo(projectId, m.minutesId)),
                    );
                }),
            );
            setMinutesDetailList(allDetails.flat());
        };

        const fetchApprovals = async (projectIds: number[]) => {
            const allDetails = await Promise.all(
                projectIds.map(async (projectId) => {
                    const data = await getApproves(projectId);
                    return Promise.all(
                        data.map((m) => getApproveInfo(projectId, m.approveId)),
                    );
                }),
            );
            setApprovalDetailList(allDetails.flat());
        };

        const fetchData = async () => {
            setIsLoading(true);
            setMinutesDetailList([]);
            setApprovalDetailList([]);

            const projectList = await getMonthlyDocuments(year, month);
            setMonthlyDocumentList(projectList);

            const projectIds = projectList.map((m) => m.projectId);

            await Promise.all([
                fetchMinutes(projectIds),
                fetchApprovals(projectIds),
            ]).finally(() => setIsLoading(false));
        };

        fetchData();
    }, [year, month]);

    const minutesDetailMap = new Map(
        minutesDetailList.map((m) => [m.minutesId, m]),
    );
    const approvalDetailMap = new Map(
        approvalDetailList.map((a) => [a.minutesId, a]),
    );

    return (
        <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold">
                {year}년 {month}월
            </p>

            {isLoading ? (
                <div className="-translate-y-30">
                    <LoadingIndicator type="minutes" />
                </div>
            ) : !monthlyDocumentList.length ? (
                <p className="text-gray-400">등록된 문서가 없습니다.</p>
            ) : (
                monthlyDocumentList.map((documentList) => (
                    <div
                        key={documentList.projectId}
                        className="flex flex-col gap-4 pr-16"
                    >
                        <p className="text-lg font-semibold">
                            {documentList.title}
                        </p>

                        {documentList.pair.map((document) => {
                            const minutesDetail = minutesDetailMap.get(
                                Number(document.minutes.minutesId),
                            );
                            const approvalDetail = document.approve?.approveId
                                ? approvalDetailMap.get(
                                      document.approve.approveId,
                                  )
                                : undefined;

                            return (
                                <div
                                    key={document.minutes.minutesId}
                                    className="flex flex-col gap-4 pr-16"
                                >
                                    <OverviewCard
                                        minutesTitle={
                                            document.minutes.minutesTitle
                                        }
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
