import OverviewCard from "./OverviewCard";
import { useOverview } from "@/store/useOverviewStore";
import { MINUTES } from "@/lib/data/overview";

export default function MonthOverviewList() {
    const { year, month } = useOverview();

    const filteredData = MINUTES.filter(
        (m) =>
            m.minutes_date.getFullYear() === year &&
            m.minutes_date.getMonth() === month,
    ).map((minutes) => ({
        minutes,
    }));

    return (
        <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold">
                {year}년 {month + 1}월
            </p>

            <div className="flex flex-col gap-6 pr-16">
                {filteredData.map(({ minutes }) => (
                    <>
                        <OverviewCard minutes={minutes} />
                    </>
                ))}
            </div>
        </div>
    );
}
