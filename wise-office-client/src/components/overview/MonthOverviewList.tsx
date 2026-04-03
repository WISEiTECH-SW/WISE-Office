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

export default function MonthOverviewList() {
    const { year, month, projectInfo } = useOverviewStore();
    const [monthlyDocumentList, setMonthlyDocumentList] = useState<
        MonthlyDocument[]
    >([]);
    const [minutesDetailList, setMinutesDetailList] = useState<MinutesInfo[]>(
        [],
    );
    const [approvalDetailList, setApprovalDetailList] = useState<
        ApprovalDetailResponse[]
    >([]);

    useEffect(() => {
        const fetchMinutes = async () => {
            const data = await getMinutes(projectInfo.projectId);

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

        const fetchData = async () => {
            const projectList = await getMonthlyDocuments(year, month);
            setMonthlyDocumentList(projectList);

            await Promise.all([fetchMinutes(), fetchApproves()]);
        };

        fetchData();
    }, [year, month]);

    return (
        <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold">
                {year}년 {month}월
            </p>

            {!monthlyDocumentList.length ? (
                <p className="text-gray-400">등록된 문서가 없습니다.</p>
            ) : (
                monthlyDocumentList.map((documentList) => (
                    <div
                        key={documentList.title}
                        className="flex flex-col gap-4 pr-16"
                    >
                        <p className="text-lg font-semibold">
                            {documentList.title}
                        </p>

                        {documentList.pair.map((document) => {
                            const minutesDetail = minutesDetailList.find(
                                (m) =>
                                    m.minutesId ===
                                    Number(document.minutes.minutesId),
                            );
                            const approvalDetail = approvalDetailList.find(
                                (a) =>
                                    a.approveId === document.approve?.approveId,
                            );

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
