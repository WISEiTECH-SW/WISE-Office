import Buttonbar from "./Buttonbar";
import { usePreviewStore } from "@/store/useOverviewStore";
import MinuteDocument from "@/components/document/MinuteDocument";
import { useEffect } from "react";
import ApprovePreview from "@/components/project/document/preview/ApprovePreview";
import { ApproveDetailResponse, MinutesDetail } from "@/types/document";
import ApproveDocument from "@/components/document/ApproveDocument";

const A4_WIDTH = 720;

export default function PreviewModal() {
    const { onClose, type, data } = usePreviewStore();

    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, []);
    if (!data) return null;

    return (
        <div>
            <Buttonbar
                key="buttonbar-top"
                position="top"
                modalWidth={A4_WIDTH}
                onClose={onClose}
            />

            {type === "minutes" && (
                <MinuteDocument minuteDetail={data as MinutesDetail} />
            )}
            {type === "approve" && (
                <ApproveDocument approve={data as ApproveDetailResponse} />
            )}

            <Buttonbar
                key="buttonbar-bottom"
                position="bottom"
                modalWidth={A4_WIDTH}
            />
        </div>
    );
}
