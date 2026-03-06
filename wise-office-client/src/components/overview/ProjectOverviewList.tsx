import { useOverview } from "@/store/useOverviewStore";
import OverviewCard from "./OverviewCard";
import { MINUTES, APPROVALS, projectNames } from "@/lib/data/overview";

export default function ProjectOverviewList() {
    const { year, projectId } = useOverview();

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
                    <div key={month} className="flex flex-col gap-4">
                        <p className="text-lg font-semibold">{month}월</p>

                        <div className="flex flex-col gap-6">
                            {data.map((minutes) => (
                                <>
                                    <OverviewCard
                                        key={minutes.minutes_pk}
                                        minutes={minutes}
                                    />
                                </>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );
}
