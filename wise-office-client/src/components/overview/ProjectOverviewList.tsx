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
    ApproveDetailResponse,
    ApproveList,
    MinutesInfo,
    MinutesList,
} from "@/types/document";

export default function ProjectOverviewList() {
    const { year, projectInfo } = useOverviewStore();
    const [minutesList, setMinutesList] = useState<MinutesList>([]);
    const [minutesInfos, setMinutesInfos] = useState<MinutesInfo[]>([]);

    // const [approveList, setApproveList] = useState<ApproveList>([]);
    const [approveInfos, setApproveInfo] = useState<ApproveDetailResponse[]>(
        [],
    );

    useEffect(() => {
        const fetchMinutes = async () => {
            const data = await getMinutes(projectInfo.projectId);
            setMinutesList(data);

            const infos = await Promise.all(
                data.map((m) =>
                    getMinutesInfo(projectInfo.projectId, m.minutesId),
                ),
            );

            setMinutesInfos(infos);
        };

        const fetchApproves = async () => {
            const data = await getApproves(projectInfo.projectId);
            // setApproveList(data);

            const infos = await Promise.all(
                data.map((m) =>
                    getApproveInfo(projectInfo.projectId, m.approveId),
                ),
            );

            setApproveInfo(infos);
        };

        if (projectInfo.projectId) {
            fetchMinutes();
            fetchApproves();
        }
    }, [projectInfo.projectId]);

    const filteredData =
        minutesList?.filter(
            (m) => new Date(m.minutesAt).getFullYear() === year,
        ) ?? [];

    const groupedByMonth = Array.from({ length: 12 }, (_, i) => {
        const month = i;

        const data = filteredData.filter(
            (m) => new Date(m.minutesAt).getMonth() === month,
        );

        return {
            month: month + 1,
            data,
        };
    }).filter((m) => m.data.length > 0);

    if (!minutesList.length || !minutesInfos.length) {
        return null;
    }

    return (
        <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold">{projectInfo.projectTitle}</p>

            {groupedByMonth
                .sort((a, b) => a.month - b.month)
                .map(({ month, data }) => (
                    <div key={month} className="flex flex-col gap-4 pr-16">
                        <p className="text-lg font-semibold">{month}월</p>

                        {data.map((minutes, index) => {
                            const minutesInfo = minutesInfos.find(
                                (info) => info.minutesId === minutes.minutesId,
                            );
                            const relatedApproves = approveInfos.filter(
                                (a) => a.minutesId === minutes.minutesId,
                            );

                            return (
                                <div
                                    key={minutes.minutesId}
                                    className={`flex flex-col gap-3 ${
                                        index !== data.length - 1
                                            ? "pb-4 border-b border-gray-200"
                                            : ""
                                    }`}
                                >
                                    {/* 회의록 */}
                                    <OverviewCard
                                        minutes={minutes}
                                        minutesInfo={minutesInfo}
                                    />
                                    {/* 품의서 */}
                                    {relatedApproves.map((approve) => (
                                        <OverviewCard
                                            key={approve.approveId}
                                            minutes={minutes}
                                            minutesInfo={minutesInfo}
                                            approve={approve}
                                            isApproval={true}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
        </div>
    );
}
