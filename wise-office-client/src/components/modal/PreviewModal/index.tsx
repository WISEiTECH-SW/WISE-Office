import { useEffect, useState } from "react";
import Buttonbar from "./Buttonbar";

const data = {
    title: "회의록 제목",
    author: "참여자01",
    date: new Date().toISOString(),
    fields: [
        {
            label: "content",
            value: "내용  ",
        },
    ],
};

export default function PreviewModal({ onClose }: { onClose: () => void }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculateScale = () => {
            const padding = 32;
            const headerFooterHeight = 64; // 상단/하단 바 높이

            const maxWidth = window.innerWidth - padding * 2;
            const maxHeight =
                window.innerHeight - headerFooterHeight - padding * 2;

            const scaleByWidth = maxWidth / 595;
            const scaleByHeight = maxHeight / Math.round(595 * Math.SQRT2);

            // 너비/높이 중 더 작은 쪽 기준으로 맞춤
            setScale(Math.min(scaleByWidth, scaleByHeight, 1)); //최댓값 지정하여 원본을 초과하지 않도록 함
        };

        calculateScale();
        window.addEventListener("resize", calculateScale);
        return () => window.removeEventListener("resize", calculateScale);
    }, []);

    const A4_WIDTH = 595 * scale;
    const A4_HEIGHT = Math.round(595 * Math.SQRT2 * scale);
    const A4_PADDING = 71 * scale;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-1000"
        >
            <div onClick={(e) => e.stopPropagation()}>
                <Buttonbar
                    key="buttonbar-top"
                    position="top"
                    modalWidth={A4_WIDTH}
                    onClose={onClose}
                />

                {/* A4 용지 */}
                <div
                    style={{
                        width: A4_WIDTH,
                        height: A4_HEIGHT,
                        padding: A4_PADDING,
                    }}
                    className={`relative bg-white overflow-y-auto`}
                >
                    {/* 회의록/품의서 내용 */}
                </div>

                <Buttonbar
                    key="buttonbar-bottom"
                    position="bottom"
                    modalWidth={A4_WIDTH}
                />
            </div>
        </div>
    );
}
