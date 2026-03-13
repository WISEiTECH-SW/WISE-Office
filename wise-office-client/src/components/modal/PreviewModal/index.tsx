import Buttonbar from "./Buttonbar";
import { usePreviewStore } from "@/store/useOverviewStore";
import MinuteDocument from "@/components/document/MinuteDocument";
import { useEffect } from "react";

const A4_WIDTH = 720;

export default function PreviewModal() {
    const { onClose } = usePreviewStore();

    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    return (
        <div>
            <Buttonbar
                key="buttonbar-top"
                position="top"
                modalWidth={A4_WIDTH}
                onClose={onClose}
            />

            <MinuteDocument />

            <Buttonbar
                key="buttonbar-bottom"
                position="bottom"
                modalWidth={A4_WIDTH}
            />
        </div>
    );
}
