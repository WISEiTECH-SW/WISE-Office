import PreviewButton from "@/components/ui/button/PreviewButton";
import PrintButton from "@/components/ui/button/PrintButton";
import {
    ApprovalDetailResponse,
    MinutesInfo,
    MinutesItem,
} from "@/types/document";

interface OverviewCardProps {
    minutesInfo: MinutesItem;
    minutesDetail?: MinutesInfo;
    approvalDetail?: ApprovalDetailResponse;
}

export default function OverviewCard({
    minutesInfo,
    minutesDetail,
    approvalDetail,
}: OverviewCardProps) {
    return (
        <div className="flex w-full bg-white border border-gray-300 rounded-lg px-2 gap-8 items-center justify-between text-sm">
            <div className="flex flex-col flex-1 min-w-0">
                {/* 회의록 행 */}
                <div className="flex justify-between gap-4">
                    <div className="w-[200px] shrink-0 pl-4 gap-2 font-normal flex items-center">
                        <p className="whitespace-nowrap">
                            {minutesDetail?.minutesDate}
                        </p>
                        <p className="whitespace-nowrap">
                            {minutesDetail?.startTime}~{minutesDetail?.endTime}
                        </p>
                    </div>
                    <div className="flex-1 flex px-2 py-3 items-center gap-6">
                        <p className="flex-1 flex justify-center text-sm">
                            회의록 · {minutesInfo.title}
                        </p>
                        <p className="flex-1 flex text-xs text-gray-600 line-clamp-3 break-keep">
                            {minutesDetail?.minutesAttendants
                                ?.map((a) => `${a.name} ${a.rank}`)
                                .join(", ")}
                        </p>
                    </div>
                    <div className="flex items-center px-2 py-3 gap-2 shrink-0">
                        <PreviewButton minutesDetail={minutesDetail ?? null} />
                        <PrintButton minutesDetail={minutesDetail ?? null} />
                    </div>
                </div>

                {/* 품의서 행 */}
                {approvalDetail && (
                    <div className="flex justify-between gap-4">
                        <div className="w-[200px] shrink-0 pl-4 font-normal flex items-center">
                            {approvalDetail.submitAt
                                .replace(/\./g, "-")
                                .replace(/-$/, "")}
                        </div>
                        <div className="flex-1 flex px-2 py-3 items-center gap-6 border-t border-gray-200">
                            <p className="flex-1 flex justify-center text-sm">
                                품의서 · {approvalDetail.approveNo}
                            </p>
                            <p className="flex-1 flex text-xs text-gray-600 line-clamp-3 break-keep">
                                {approvalDetail.writer}
                            </p>
                        </div>
                        <div className="flex items-center px-2 py-3 gap-2 shrink-0">
                            <PreviewButton
                                approvalDetail={approvalDetail ?? null}
                            />
                            <PrintButton
                                approvalDetail={approvalDetail ?? null}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
