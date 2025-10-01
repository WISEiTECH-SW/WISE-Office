import { useEffect, useMemo, useState } from "react";
import LeaveHistory from "./LeaveHistory";
import SummaryField from "./SummaryField";
import { getJoinDate } from "@/services/members";

export default function OutputSection() {
    const [joinDate, setJoinDate] = useState<string>("");

    useEffect(() => {
        getJoinDate()
            .then((date) => setJoinDate(date))
            .catch(() => setJoinDate(""));
    }, []);

    const today = new Date();
    const thisYear = today.getFullYear();
    const joinYear = useMemo(() => {
        if (!joinDate) return undefined;
        return Number(joinDate.split("-")[0]);
    }, [joinDate]);

    return (
        <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden ">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-[0_2px_0_0_rgba(0,0,0,0.03)]">
                <div className="p-8 pb-4">
                    <SummaryField
                        today={today}
                        joinDate={joinDate}
                        setJoinDate={setJoinDate}
                        thisYear={thisYear}
                        joinYear={joinYear ?? thisYear}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <div className="bg-white px-8 py-4">
                    <p className="font-bold text-gray-900 text-lg">
                        연도별 연차 사용 현황
                    </p>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-auto-hide overscroll-contain px-8 pb-4">
                    {joinYear !== undefined ? (
                        <LeaveHistory thisYear={thisYear} joinYear={joinYear} />
                    ) : (
                        <p className="text-sm text-gray-500">
                            입사일을 입력해 연도별 연차 사용 내역을 확인하세요.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
