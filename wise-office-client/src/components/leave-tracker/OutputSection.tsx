import { useState } from "react";
import JoinDateField from "./JoinDateField";
import LeaveHistory from "./LeaveHistory";
import SummaryField from "./SummaryField";

export default function OutputSection() {
    const [joinDate, setJoinDate] = useState("");
    const today = new Date();
    const thisYear = Number(today.getFullYear());
    const joinYear = Number(joinDate.split("-")[0]);

    return (
        <div className="w-full h-[42vh] bg-white border border-gray-200 rounded-lg shadow-sm p-8 overflow-y-auto scrollbar-auto-hide overscroll-contain">
            <JoinDateField joinDate={joinDate} setJoinDate={setJoinDate} />
            <SummaryField
                today={today}
                joinDate={joinDate}
                thisYear={thisYear}
                joinYear={joinYear}
            />
            <LeaveHistory thisYear={thisYear} joinYear={joinYear} />
        </div>
    );
}
