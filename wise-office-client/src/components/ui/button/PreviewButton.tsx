import { usePreviewStore } from "@/store/useOverviewStore";
import { MinutesInfo } from "@/types/document";
import { LucideFileSearch } from "lucide-react";

export default function PreviewButton({
    minutesInfo,
}: {
    minutesInfo: MinutesInfo | null;
}) {
    const { onOpen, setMinutesInfo } = usePreviewStore();

    const handleClick = () => {
        if (!minutesInfo) return;
        setMinutesInfo(minutesInfo);
        onOpen();
    };

    return (
        <button
            onClick={handleClick}
            className="flex border border-gray-400 rounded-md p-1 items-center bg-background-default hover:bg-gray-200 cursor-pointer"
        >
            <LucideFileSearch size={12} strokeWidth={1} />
            <p className="text-xs px-1">미리보기</p>
        </button>
    );
}
