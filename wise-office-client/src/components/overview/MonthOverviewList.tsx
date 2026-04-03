// import OverviewCard from "./OverviewCard";
import { useOverviewStore } from "@/store/useOverviewStore";
import { MINUTES } from "@/lib/data/overview";

export default function MonthOverviewList() {
    const { year, month } = useOverviewStore();

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

            <div className="flex flex-col gap-4 pr-16">
                {filteredData.map(({ minutes }, index) => (
                    <div
                        key={minutes.minutes_pk}
                        className={`flex flex-col gap-3 ${
                            index !== filteredData.length - 1
                                ? "pb-4 border-b border-gray-200"
                                : ""
                        }`}
                    >
                        {/* 다음 작업 예정 */}
                        {/* <OverviewCard
                            key={`${minutes.minutes_pk}-minutes`}
                            minutes={{
                                minutesId: minutes.minutes_pk,
                                title: minutes.title,
                                minutesAt: minutes.minutes_date.toISOString(),
                            }}
                        />
                        <OverviewCard
                            key={`${minutes.minutes_pk}-approval`}
                            minutes={{
                                minutesId: minutes.minutes_pk,
                                title: minutes.title,
                                minutesAt: minutes.minutes_date.toISOString(),
                            }}
                            isApproval={true}
                        /> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
