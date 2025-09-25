import { useCallback, useState } from "react";
import { validateTsv } from "@/utils/validateTsv";
import type { Row } from "@/types/annualLeave";
import InputSection from "@/components/leave-tracker/InputSection";
import OutputSection from "@/components/leave-tracker/OutputSection";
import LeaveTableSection from "@/components/leave-tracker/LeaveTableSection";

export default function LeaveTracker() {
    const [text, setText] = useState("");
    const [appliedText, setAppliedText] = useState("");
    const [data, setData] = useState<Row[]>([]);
    const [error, setError] = useState("");

    const onApply = useCallback(() => {
        const result = validateTsv(text);

        if (!result.ok) {
            setError(result.errors);
            return;
        }

        setError("");
        setData(result.rows!);
        setAppliedText(text);
        setText("");
    }, [text]);

    return (
        <div className="flex flex-col items-center gap-6 max-w-screen-lg mx-auto my-10 md:my-20 px-2">
            <div className="w-full flex flex-col md:flex-row gap-6 min-h-0">
                <InputSection
                    text={text}
                    setText={setText}
                    error={error}
                    onApply={onApply}
                />
                <OutputSection />
            </div>
            <LeaveTableSection data={data} />
        </div>
    );
}
