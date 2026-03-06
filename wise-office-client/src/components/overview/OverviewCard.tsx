import { Minutes, Approval } from "@/types/document";
import PreviewButton from "@/components/ui/button/PreviewButton";
import PrintButton from "@/components/ui/button/PrintButton";
import { APPROVALS } from "@/lib/data/overview";

interface Props {
    minutes?: Minutes;
    isApproval?: boolean;
}

export default function OverviewCard({ minutes, isApproval }: Props) {
    return (
        <div className="flex bg-white border border-gray-300 rounded-lg px-4 py-2 items-center justify-between gap-6">
            {/* 문서 정보 */}
            <div className="flex-1 grid grid-cols-3">
                {/* 날짜/시간 */}
                <div className="col-span-1 flex flex-col 2xl:flex-row gap-2">
                    <p>{minutes?.minutes_date.toLocaleDateString("sv")}</p>
                    <p>
                        {minutes?.start_time}~{minutes?.end_time}
                    </p>
                </div>
                {/* 문서번호 */}
                <p className="col-span-1 flex items-center">
                    {isApproval
                        ? APPROVALS.find(
                              (a) => a.meeting_pk === minutes?.minutes_pk,
                          )?.report_no
                        : minutes?.minutes_number}
                </p>
                {/* 참석자 명단 */}
                <p className="col-span-1 text-xs flex items-center">
                    {minutes?.inst_attendants.join(" ")}
                </p>
            </div>

            {/* 버튼 */}
            <div className="flex justify-between gap-2">
                <PreviewButton />
                <PrintButton />
            </div>
        </div>
    );
}
