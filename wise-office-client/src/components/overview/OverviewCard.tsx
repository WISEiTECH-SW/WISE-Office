import PreviewButton from "@/components/ui/button/PreviewButton";
import PrintButton from "@/components/ui/button/PrintButton";
import {
    ApproveDetailResponse,
    MinutesInfo,
    MinutesItem,
} from "@/types/document";

interface Props {
    minutes: MinutesItem;
    minutesInfo?: MinutesInfo;
    approve?: ApproveDetailResponse;
    isApproval?: boolean;
}

export default function OverviewCard({
    minutes,
    minutesInfo,
    approve,
    isApproval,
}: Props) {
    return (
        <div className="flex w-full bg-white border border-gray-300 rounded-lg px-4 py-2 items-center justify-between gap-6">
            {/* 문서 정보 */}
            <div className="flex flex-1 gap-6 items-center min-w-0">
                {/* 날짜/시간 */}
                <div className="flex flex-col 2xl:flex-row gap-2 shrink-0 w-[220px]">
                    <p>
                        {isApproval && approve
                            ? approve.writtenAt
                            : minutes.minutesAt}
                    </p>
                    <p>
                        {!isApproval && (
                            <p>
                                {minutesInfo?.startTime}~{minutesInfo?.endTime}
                            </p>
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-2 flex-1 min-w-0 gap-6">
                    <div className="col-span-1 flex justify-center items-center">
                        {/* 문서번호 */}
                        {isApproval && approve
                            ? `품의서 · ${approve?.approveNo}`
                            : `회의록 · ${minutes?.title}`}
                    </div>
                    {/* 참석자 명단 */}
                    <div className="col-span-1 text-xs flex items-center">
                        {isApproval
                            ? approve?.writer
                            : minutesInfo?.minutesAttendants?.length
                              ? minutesInfo.minutesAttendants
                                    .map((m) => `${m.name} ${m.rank}`)
                                    .join(", ")
                              : ""}
                    </div>
                </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-between gap-2 shrink-0">
                {isApproval ? (
                    <PreviewButton approveInfo={approve ?? null} />
                ) : (
                    <PreviewButton minutesInfo={minutesInfo ?? null} />
                )}
                <PrintButton minutesInfo={minutesInfo ?? null} />
            </div>
        </div>
    );
}
