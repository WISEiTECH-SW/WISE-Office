import { usePreviewStore } from "@/store/useOverviewStore";
import { ApprovalDetailResponse, MinutesInfo } from "@/types/document";
import { LucideFileSearch } from "lucide-react";

export default function PreviewButton({
    minutesDetail,
    approvalDetail,
}: {
    minutesDetail?: MinutesInfo | null;
    approvalDetail?: ApprovalDetailResponse | null;
}) {
    const { onOpen, setPreview } = usePreviewStore();

    const handleClick = () => {
        if (minutesDetail) {
            setPreview("minutes", minutesDetail);
            onOpen();
            return;
        }

        // 품의서
        if (approvalDetail) {
            setPreview("approve", approvalDetail);
            onOpen();
            return;
        }
    };

    return (
        <button
            onClick={handleClick}
            className="h-6 flex border border-gray-400 rounded-md p-2 items-center bg-background-default hover:bg-gray-200 cursor-pointer"
        >
            <LucideFileSearch size={12} strokeWidth={1} />
            <p className="text-xs px-1">미리보기</p>
        </button>
    );
}
