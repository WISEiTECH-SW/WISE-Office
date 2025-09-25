import { useState } from "react";
import JoinDateField from "./JoinDateFeild";
import LeaveHistory from "./LeaveHistory";
import SummaryField from "./SummaryField";

export default function OutputSection() {
    const [joinDate, setJoinDate] = useState("");

    return (
        <div className="w-full h-80 bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-y-auto scrollbar-auto-hide">
            <JoinDateField joinDate={joinDate} setJoinDate={setJoinDate} />
            <SummaryField />
            <LeaveHistory joinDate={joinDate} />
        </div>
    );
}
