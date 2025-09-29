import { useCallback, useState } from "react";
import { validateTsv } from "@/utils/validateTsv";
import { useLeaveStore } from "@/store/useLeaveStore";
import InputSection from "@/components/leave-tracker/InputSection/index";
import OutputSection from "@/components/leave-tracker/OutputSection/index";
import LeaveTableSection from "@/components/leave-tracker/LeaveTableSection";

export default function LeaveTracker() {
    const [text, setText] = useState("");
    const { setInputData } = useLeaveStore();
    const [error, setError] = useState("");

    const onApply = useCallback(() => {
        const result = validateTsv(text);

        if (!result.ok) {
            setError(result.errors);
            return;
        }

        setError("");
        setInputData(result.rows!);
        setText("");
    }, [text]);

    return (
        <div className="flex flex-col items-center gap-6 max-w-screen-lg mx-auto my-14 px-2">
            <div className="w-full md:h-[72vh] flex flex-col md:flex-row gap-6 min-h-0">
                <InputSection
                    text={text}
                    setText={setText}
                    error={error}
                    onApply={onApply}
                />
                <OutputSection />
            </div>
            <LeaveTableSection />
        </div>
    );
}
