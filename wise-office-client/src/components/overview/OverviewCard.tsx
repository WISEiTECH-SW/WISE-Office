import { MINUTES, APPROVALS } from "@/lib/data/overview";

type Minute = (typeof MINUTES)[number];
type Approval = (typeof APPROVALS)[number] | undefined;

export default function OverviewCard({
    minute,
    approval,
}: {
    minute: Minute;
    approval: Approval;
}) {
    return (
        <div className="flex border border-gray-300 rounded-xl h-16 p-8 items-center justify-between gap-8">
            <div className="flex-1 flex justify-between">
                {/* 날짜/시간 */}
                <div className="flex justify-between gap-8">
                    <p>{minute.minutes_date.toLocaleDateString("ko-KR")}</p>
                    <p>
                        {minute.start_time}~{minute.end_time}
                    </p>
                </div>
                {/* 문서번호 */}
                <p className="flex justify-center">
                    {minute.minutes_number || "-"}
                </p>
                {/* 참석자 명단 */}
                <p className="flex">{minute.inst_attendants.join(" ")}</p>
            </div>
            <div className="flex justify-between gap-8">
                <p>button</p>
                <p>button</p>
            </div>
        </div>
    );
}
