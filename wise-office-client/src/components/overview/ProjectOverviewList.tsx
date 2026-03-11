import { useOverviewStore } from "@/store/useOverviewStore";
import OverviewCard from "./OverviewCard";
import { MINUTES, projectNames } from "@/lib/data/overview";

export default function ProjectOverviewList() {
    const { year, projectId } = useOverviewStore();

    const projectName = projectNames.find(
        (m) => m.project_pk === projectId,
    )?.title;

    const filteredData = MINUTES.filter(
        (m) =>
            m.project_pk === projectId && m.minutes_date.getFullYear() === year,
    );

    const groupedByMonth = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;

        return {
            month,
            data: filteredData.filter(
                (m) => m.minutes_date.getMonth() + 1 === month,
            ),
        };
    }).filter((m) => m.data.length > 0);

    return (
        <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold">{projectName}</p>

            {groupedByMonth
                .sort((a, b) => a.month - b.month)
                .map(({ month, data }) => (
                    <div key={month} className="flex flex-col gap-4 pr-16">
                        <p className="text-lg font-semibold">{month}월</p>

                        {data.map((minutes, index) => (
                            <div
                                key={minutes.minutes_pk}
                                className={`flex flex-col gap-3 ${
                                    index !== data.length - 1
                                        ? "pb-4 border-b border-gray-200"
                                        : ""
                                }`}
                            >
                                <OverviewCard
                                    key={`${minutes.minutes_pk}-minutes`}
                                    minutes={minutes}
                                />
                                <OverviewCard
                                    key={`${minutes.minutes_pk}-approval`}
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
