import { useEffect, useState } from "react";
import PreviewButton from "@/components/ui/button/PreviewButton";
import PrintButton from "@/components/ui/button/PrintButton";
import { getMinutesInfo } from "@/services/overview";
import { useOverviewStore } from "@/store/useOverviewStore";
import { MinutesInfo, MinutesItem } from "@/types/document";

interface Props {
    minutes: MinutesItem;
    isApproval?: boolean;
}

export default function OverviewCard({ minutes, isApproval }: Props) {
    const { projectInfo } = useOverviewStore();
    const [minutesInfo, setMinutesInfo] = useState<MinutesInfo>();

    console.log(minutes);

    useEffect(() => {
        if (!projectInfo.projectId || !minutes?.minutesId) return;

        const fetchInfo = async () => {
            const data = await getMinutesInfo(
                projectInfo.projectId,
                minutes.minutesId,
            );
            setMinutesInfo(data);
        };

        fetchInfo();
    }, [projectInfo.projectId, minutes?.minutesId]);

    return (
        <div className="flex bg-white border border-gray-300 rounded-lg px-4 py-2 items-center justify-between gap-6">
            {/* 문서 정보 */}
            <div className="flex-1 grid grid-cols-3">
                {/* 날짜/시간 */}
                <div className="col-span-1 flex flex-col 2xl:flex-row gap-2">
                    <p>
                        {new Date(
                            minutesInfo?.minutesDate ?? "",
                        ).toLocaleDateString("sv")}
                    </p>
                    <p>
                        {minutesInfo?.startTime}~{minutesInfo?.endTime}
                    </p>
                </div>
                {/* 문서번호 */}
                <p className="col-span-1 flex items-center">
                    {isApproval && minutes?.minutesId
                        ? "품의서"
                        : minutes?.title}
                </p>
                {/* 참석자 명단 */}
                <p className="col-span-1 text-xs flex items-center">
                    {minutesInfo?.instAttendants}
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
