import Button from "@/components/common/Button";
import MinuteDocument from "@/components/document/MinuteDocument";
import { useApproveCreation } from "@/hooks/project/useDocuments";
import { usePreviewStore } from "@/store/useOverviewStore";
import { MinutesDetail } from "@/types/document";
import { DeleteModalState } from "@/types/project";
import { useEffect } from "react";
import BasePreview from "./BasePreview";
import { Edit, Printer, Trash2, FileSearch, FilePlus2 } from "lucide-react";

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
        <div className="rounded-lg shadow-sm">
            {isAttending && (
                <div className="flex rounded-t-lg flex-row gap-4 p-4 bg-white/80">
                    {approveId ? (
                        <Button
                            label="품의서 조회"
                            onClick={() => onSelectApprove(approveId)}
                            variant="primary"
                            icon={<FileSearch className="w-4 h-4" />}
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
                            icon={<FilePlus2 className="w-4 h-4" />}
                        />
                    )}
                    <Button
                        label="출력"
                        onClick={() => {
                            window.print();
                        }}
                        variant="primary"
                        icon={<Printer className="w-4 h-4" />}
                    />
                    <Button
                        label="수정"
                        onClick={() => onEdit("minute", minuteDetail.minutesId)}
                        variant="secondary"
                        icon={<Edit className="h-4 w-4" />}
                    />
                    <Button
                        label="삭제"
                        onClick={() =>
                            onDelete({
                                type: "minute",
                                id: minuteDetail.minutesId,
                            })
                        }
                        variant="danger"
                        icon={<Trash2 className="h-4 w-4" />}
                    />
                </div>
            )}
            <div className="p-4 rounded-b-lg bg-blue-50">
                <div className="print-area">
                    <MinuteDocument />
                </div>
            </div>
        </div>
    );
}
