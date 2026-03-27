import { Printer } from "lucide-react";
import { usePreviewStore } from "@/store/useOverviewStore";
import { ApproveDetailResponse, MinutesInfo } from "@/types/document";

export default function PrintButton({
    minutesInfo,
    approveInfo,
}: {
    minutesInfo?: MinutesInfo | null;
    approveInfo?: ApproveDetailResponse | null;
}) {
    const { setPreview, onOpen } = usePreviewStore();

    const onPrint = () => {
        if (minutesInfo) {
            setPreview("minutes", minutesInfo);
            setTimeout(() => {
                window.print();
            }, 0);
        } else if (approveInfo) {
            setPreview("approve", approveInfo);
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
            className="flex border border-gray-400 rounded-md p-1 items-center bg-background-default hover:bg-gray-200 cursor-pointer"
        >
            <Printer size={12} strokeWidth={1} />
            <p className="text-xs px-1">인쇄</p>
        </button>
    );
}
