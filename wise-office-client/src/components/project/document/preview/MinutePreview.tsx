import { DeleteModalState, SelectedDocument } from "@/types/project";
import { MinutesDetail } from "@/types/document";
import { Edit, Printer, Trash2, FileSearch, FilePlus2 } from "lucide-react";

import Button from "@/components/ui/Button";
import MinuteDocument from "@/components/document/MinuteDocument";

interface MinutePreviewProps {
    minuteDetail: MinutesDetail;
    isAttending: boolean;
    onEdit: () => void;
    onDelete: (deleteTarget: DeleteModalState) => void;
    onRelate: (doc: SelectedDocument) => void;
    createApprove: () => void;
}

export default function MinutePreview({
    minuteDetail,
    isAttending,
    onEdit,
    onDelete,
    onRelate,
    createApprove,
}: MinutePreviewProps) {
    const haveApprove = minuteDetail.approveId !== null;

    const handleClickApprove = () => {
        if (haveApprove)
            onRelate({ type: "approve", id: minuteDetail.approveId! });
        else createApprove();
    };

    return (
        <div className="rounded-lg shadow-sm">
            {isAttending && (
                <div className="flex rounded-t-lg flex-row gap-4 p-4 bg-white/80">
                    <Button
                        label={haveApprove ? "품의서 조회" : "품의서 생성"}
                        onClick={handleClickApprove}
                        variant="primary"
                        icon={
                            haveApprove ? (
                                <FileSearch className="w-4 h-4" />
                            ) : (
                                <FilePlus2 className="w-4 h-4" />
                            )
                        }
                    />
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
                        onClick={onEdit}
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
                    <MinuteDocument minuteDetail={minuteDetail} />
                </div>
            </div>
        </div>
    );
}
