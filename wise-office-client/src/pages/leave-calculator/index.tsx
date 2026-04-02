import InputSection from "@/components/leave-tracker/InputSection/index";
import LeaveTableSection from "@/components/leave-tracker/LeaveTableSection";
import OutputSection from "@/components/leave-tracker/OutputSection/index";
import { useLeaveStore } from "@/store/useLeaveStore";
import { validateTsv } from "@/utils/validateTsv";
import { useCallback, useState } from "react";

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
    }, [text, setInputData]);

    return (
        <div className="flex flex-col items-center gap-6 max-w-screen-lg mx-auto my-14 px-2">
            <div className="w-full md:h-[62vh] flex flex-col md:flex-row gap-6 min-h-0">
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
