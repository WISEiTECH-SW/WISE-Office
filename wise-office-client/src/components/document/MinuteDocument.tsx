import { LabelCell } from "./LabelCell";
import ApprovalSeal from "./ApprovalSeal";
import { usePreviewStore } from "@/store/useOverviewStore";
import { ReadableCell } from "./ReadableCell";

export default function MinuteDocument() {
    const { minutesInfo } = usePreviewStore();

    if (!minutesInfo) return null;

    console.log(minutesInfo);

    return (
        <div className="bg-white w-full max-w-[720px] min-h-[1020px] h-full px-[80px] pt-[92px] pb-[120px] flex flex-col">
            {/* 결제 란 */}
            <ApprovalSeal />

            {/* 제목 */}
            <div className="text-center font-serif font-bold text-2xl tracking-[12px] mb-1 text-black">
                회 의 록
            </div>

            <div className="w-3/5 mx-auto h-1 bg-gradient-to-r from-black via-white to-black mb-6" />

            {/* 상세사항 */}
            <table className="w-full border-collapse">
                <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <LabelCell label="과제명" />
                        <ReadableCell colSpan={3} value={minutesInfo.title} />
                    </tr>
                    <tr>
                        <LabelCell label="회의주관기관" />
                        <ReadableCell colSpan={3} value={minutesInfo.host} />
                    </tr>
                    <tr className="h-4"></tr>
                </tbody>

                <tbody>
                    <tr>
                        <LabelCell label="회의 일시" />
                        <ReadableCell
                            colSpan={2}
                            value={new Date(
                                minutesInfo.minutesDate,
                            ).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "long",
                            })}
                        />
                        <ReadableCell
                            colSpan={1}
                            value={`${minutesInfo.startTime} ~ ${minutesInfo.endTime}`}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="회의 장소" />
                        <ReadableCell
                            colSpan={3}
                            value={minutesInfo.location}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="회의 목적" />
                        <ReadableCell colSpan={3} value={minutesInfo.purpose} />
                    </tr>
                    <tr style={{ height: "120px" }}>
                        <LabelCell label="참 석 자" />
                        <ReadableCell
                            colSpan={3}
                            value={minutesInfo.minutesAttendants}
                            textAlign={"text-start"}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="작 성 자" />
                        <ReadableCell
                            colSpan={3}
                            value={minutesInfo.writer}
                            textAlign={"text-start"}
                        />
                    </tr>
                    <tr className="h-4"></tr>
                </tbody>
            </table>

            <div className="text-center font-semibold py-2 border border-black text-sm text-black tracking-widest bg-gray-300">
                회 의 내 용
            </div>
            <textarea
                value={minutesInfo.content}
                readOnly
                className="w-full border border-t-0 border-black p-4 text-sm leading-relaxed 
                        text-slate-800 resize-none overflow-hidden focus:outline-none rounded-b flex-1"
            />
        </div>
    );
}
