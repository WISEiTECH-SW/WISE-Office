import { useApproval } from "@/store/useApprovalStore";
import OverviewCard from "./OverviewCard";
import { MINUTES, APPROVALS } from "@/lib/data/overview";

export default function OverviewList() {
    const { year, projectId } = useApproval();

    const filteredMinutes = MINUTES.filter(
        (m) =>
            m.project_pk === projectId && m.minutes_date.getFullYear() === year,
    );

    const filteredData = filteredMinutes.map((minute) => {
        const approval = APPROVALS.find(
            (a) => a.meeting_pk === minute.minutes_pk,
        );
        return { minute, approval };
    });

    console.log({ filteredMinutes, filteredData });

    return (
        <div className="flex flex-col gap-6 px-8">
            {filteredData.map(({ minute, approval }) => (
                <OverviewCard
                    key={minute.minutes_pk}
                    minute={minute}
                    approval={approval}
                />
            ))}
        </div>
    );
}
