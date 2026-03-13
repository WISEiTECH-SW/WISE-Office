import Button from "@/components/common/Button";
import MinuteDocument from "@/components/document/MinuteDocument";
import { useApproveCreation } from "@/hooks/project/useDocuments";
import { usePreviewStore } from "@/store/useOverviewStore";
import { MinutesDetail } from "@/types/document";
import { DeleteModalState } from "@/types/project";
import { useEffect } from "react";
import BasePreview from "./BasePreview";

interface MinutePreviewProps {
    projectId: number;
    projectTitle: string;
    minuteDetail: MinutesDetail | undefined;
    isAttending: boolean;
    onEdit: (docType: string, docId: number) => void;
    onDelete: (deleteTarget: DeleteModalState) => void;
    onSelectApprove: (approveId: number) => void;
}

type MinuteDetailWithApproveId = MinutesDetail & {
    approveId?: number | null;
};

export default function MinutePreview({
    projectId,
    projectTitle,
    minuteDetail,
    isAttending,
    onEdit,
    onDelete,
    onSelectApprove,
}: MinutePreviewProps) {
    const createApprove = useApproveCreation();
    const approveId = (minuteDetail as MinuteDetailWithApproveId | undefined)
        ?.approveId;

    const { setMinutesInfo } = usePreviewStore();

    useEffect(() => {
        if (minuteDetail) {
            setMinutesInfo({
                ...minuteDetail,
                title: projectTitle,
            });
        }
    }, [minuteDetail, projectTitle, setMinutesInfo]);

    if (!minuteDetail) {
        return <BasePreview type="minute" />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col p-4 md:pt-6">
                {isAttending && (
                    <div className="flex flex-row gap-4">
                        {approveId ? (
                            <Button
                                label="품의서 조회"
                                onClick={() => onSelectApprove(approveId)}
                                variant="primary"
                            />
                        ) : (
                            <Button
                                label="품의서 생성"
                                onClick={() =>
                                    createApprove.mutate({
                                        projectId: Number(projectId),
                                        minutesId: minuteDetail.minutesId,
                                    })
                                }
                                variant="primary"
                            />
                        )}
                        <Button
                            label="출력하기"
                            onClick={() => {
                                window.print();
                            }}
                            variant="secondary"
                        />
                        <Button
                            label="수정하기"
                            onClick={() =>
                                onEdit("minute", minuteDetail.minutesId)
                            }
                            variant="primary"
                        />
                        <Button
                            label="삭제하기"
                            onClick={() =>
                                onDelete({
                                    type: "minute",
                                    id: minuteDetail.minutesId,
                                })
                            }
                            variant="danger"
                        />
                    </div>
                )}

                <div className="print-area flex justify-center ">
                    <MinuteDocument />
                </div>
            </div>
        </div>
    );
}
