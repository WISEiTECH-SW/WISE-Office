import { useState } from "react";
import LeaveHistory from "./LeaveHistory";
import SummaryField from "./SummaryField";

export default function OutputSection() {
    const [joinDate, setJoinDate] = useState("");
    const today = new Date();
    const thisYear = Number(today.getFullYear());
    const joinYear = Number(joinDate.split("-")[0]) || thisYear;

    return (
        <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
            <div className="sticky top-0 z-10 -mx-8 bg-white border-b border-gray-200 shadow-[0_2px_0_0_rgba(0,0,0,0.03)]">
                <div className="p-8 pb-4">
                    <SummaryField
                        today={today}
                        joinDate={joinDate}
                        thisYear={thisYear}
                        joinYear={joinYear}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 px-8 py-6 overflow-y-auto scrollbar-auto-hide overscroll-contain">
                <LeaveHistory thisYear={thisYear} joinYear={joinYear} />
            </div>
        </div>
    );
}
