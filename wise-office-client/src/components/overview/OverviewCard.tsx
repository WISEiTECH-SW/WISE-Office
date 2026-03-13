import PreviewButton from "@/components/ui/button/PreviewButton";
import PrintButton from "@/components/ui/button/PrintButton";
import { MinutesInfo, MinutesItem } from "@/types/document";

interface Props {
    minutes: MinutesItem;
    minutesInfo?: MinutesInfo;
    isApproval?: boolean;
}

export default function OverviewCard({
    minutes,
    minutesInfo,
    isApproval,
}: Props) {
    return (
        <div className="flex bg-white border border-gray-300 rounded-lg px-4 py-2 items-center justify-between gap-6">
            {/* 날짜/시간 */}
            <div className="col-span-1 flex flex-col 2xl:flex-row gap-2">
                <p>{minutes.minutesAt}</p>
                <p>
                    {" "}
                    {minutesInfo?.startTime}~{minutesInfo?.endTime}
                </p>
            </div>

            {/* 문서 정보 */}
            <div className="flex-1 grid grid-cols-2">
                {/* 문서번호 */}
                <p className="col-span-1 flex items-center">
                    {isApproval && minutes?.minutesId
                        ? `품의서 · ${minutes?.title}`
                        : `회의록 · ${minutes?.title}`}
                </p>
                {/* 참석자 명단 */}
                <p className="col-span-1 text-xs flex items-center">
                    {minutesInfo?.instAttendants}
                </p>
            </div>

            {/* 버튼 */}
            <div className="flex justify-between gap-2">
                <PreviewButton minutesInfo={minutesInfo ?? null} />
                <PrintButton minutesInfo={minutesInfo ?? null} />
            </div>
        </div>
    );
}
