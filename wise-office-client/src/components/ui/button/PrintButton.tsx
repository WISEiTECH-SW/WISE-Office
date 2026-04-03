import { Printer } from "lucide-react";
import { usePreviewStore } from "@/store/useOverviewStore";
import { ApprovalDetailResponse, MinutesInfo } from "@/types/document";

export default function PrintButton({
    minutesDetail,
    approvalDetail,
}: {
    minutesDetail?: MinutesInfo | null;
    approvalDetail?: ApprovalDetailResponse | null;
}) {
    const { setPreview } = usePreviewStore();

    const onPrint = () => {
        if (minutesDetail) {
            setPreview("minutes", minutesDetail);
            setTimeout(() => {
                window.print();
            }, 0);
        } else if (approvalDetail) {
            setPreview("approve", approvalDetail);
            setTimeout(() => {
                window.print();
            }, 0);
        } else {
            window.print();
        }
    };

    return (
        <button
            onClick={onPrint}
            className="h-6 flex border border-gray-400 rounded-md p-2 items-center bg-background-default hover:bg-gray-200 cursor-pointer"
        >
            <Printer size={12} strokeWidth={1} />
            <p className="text-xs px-1">인쇄</p>
        </button>
    );
}
