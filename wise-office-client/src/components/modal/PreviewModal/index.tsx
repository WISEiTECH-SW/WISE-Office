import { useEffect, useState } from "react";
import Buttonbar from "./Buttonbar";
import { usePreview } from "@/store/useOverviewStore";

const A4_WIDTH = 595;
const A4_HEIGHT = Math.round(595 * Math.SQRT2);
const A4_PADDING = 71;
const MODAL_PADDING = 32;
const HEADER_FOOTER_HEIGHT = 64;

export default function PreviewModal() {
    const { onClose } = usePreview();
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculateScale = () => {
            const maxWidth = window.innerWidth - MODAL_PADDING * 2;
            const maxHeight =
                window.innerHeight - HEADER_FOOTER_HEIGHT - MODAL_PADDING * 2;

            const scaleByWidth = maxWidth / 595;
            const scaleByHeight = maxHeight / Math.round(595 * Math.SQRT2);

            // 너비/높이 중 더 작은 쪽 기준으로 맞춤
            setScale(Math.min(scaleByWidth, scaleByHeight, 1)); //최댓값 지정하여 원본을 초과하지 않도록 함
        };

        calculateScale();
        window.addEventListener("resize", calculateScale);
        return () => window.removeEventListener("resize", calculateScale);
    }, []);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-1000"
        >
            <div onClick={(e) => e.stopPropagation()}>
                <Buttonbar
                    key="buttonbar-top"
                    position="top"
                    modalWidth={A4_WIDTH * scale}
                    onClose={onClose}
                />

                {/* A4 용지 */}
                <div
                    style={{
                        width: A4_WIDTH * scale,
                        height: A4_HEIGHT * scale,
                        padding: A4_PADDING * scale,
                    }}
                    className="relative bg-white overflow-hidden"
                >
                    <div className="print-area">{/* 회의록/품의서 내용 */}</div>
                </div>

                <Buttonbar
                    key="buttonbar-bottom"
                    position="bottom"
                    modalWidth={A4_WIDTH * scale}
                />
            </div>
        </div>
    );
}
