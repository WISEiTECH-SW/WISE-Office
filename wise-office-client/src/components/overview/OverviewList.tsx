import { useApproval } from "@/store/useApprovalStore";
import OverviewCard from "./OverviewCard";
import { MINUTES, APPROVALS } from "@/lib/data/overview";

export default function OverviewList() {
    const { year, projectId } = useApproval();

    const filteredData = MINUTES.filter(
        (m) =>
            m.project_pk === projectId && m.minutes_date.getFullYear() === year,
    ).map((minutes) => ({
        minutes,
    }));

    return (
        <div className="flex flex-col gap-6 px-8">
            {filteredData.map(({ minutes }) => (
                <>
                    <OverviewCard minutes={minutes!} />
                </>
            ))}
        </div>
    );
}
