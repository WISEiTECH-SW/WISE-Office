import { useEffect, useState } from "react";
import OverviewCard from "./OverviewCard";
import { useOverviewStore } from "@/store/useOverviewStore";
import { getMinutes } from "@/services/overview";
import { MinutesList } from "@/types/document";

export default function ProjectOverviewList() {
    const { year, projectInfo } = useOverviewStore();
    const [minutesList, setMinutesList] = useState<MinutesList>();

    useEffect(() => {
        const fetchMinutes = async () => {
            const data = await getMinutes(projectInfo.projectId);
            setMinutesList(data);
        };

        fetchMinutes();
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

    return (
        <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold">{projectInfo.projectTitle}</p>

            {groupedByMonth
                .sort((a, b) => a.month - b.month)
                .map(({ month, data }) => (
                    <div key={month} className="flex flex-col gap-4 pr-16">
                        <p className="text-lg font-semibold">{month}월</p>

                        {data.map((minutes, index) => (
                            <div
                                key={minutes.minutesId}
                                className={`flex flex-col gap-3 ${
                                    index !== data.length - 1
                                        ? "pb-4 border-b border-gray-200"
                                        : ""
                                }`}
                            >
                                <OverviewCard
                                    key={`${minutes.minutesId}-minutes`}
                                    minutes={minutes}
                                />
                                <OverviewCard
                                    key={`${minutes.minutesId}-approval`}
                                    minutes={minutes}
                                    isApproval={true}
                                />
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    );
}
