import { usePreviewStore } from "@/store/useOverviewStore";
import { ApproveDetailResponse, MinutesInfo } from "@/types/document";
import { LucideFileSearch } from "lucide-react";

export default function PreviewButton({
    minutesInfo,
    approveInfo,
}: {
    minutesInfo?: MinutesInfo | null;
    approveInfo?: ApproveDetailResponse | null;
}) {
    const { onOpen, setPreview } = usePreviewStore();

    const handleClick = () => {
        if (minutesInfo) {
            setPreview("minutes", minutesInfo);
            onOpen();
            return;
        }

        // 품의서
        if (approveInfo) {
            setPreview("approve", approveInfo);
            onOpen();
            return;
        }
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
