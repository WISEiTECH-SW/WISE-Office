import { useState } from "react";
import InputSection from "@/components/leave-tracker/InputSection";
import OutputSection from "@/components/leave-tracker/OutputSection";
import LeaveTableSection from "@/components/leave-tracker/LeaveTableSection";

export default function LeaveTracker() {
    return (
        <div className="flex flex-col items-center gap-6 max-w-screen-lg mx-auto my-10 md:my-20 px-2">
            <div className="w-full flex flex-col md:flex-row gap-6">
                <InputSection />
                <OutputSection />
            </div>
            <LeaveTableSection />
        </div>
    );
}
