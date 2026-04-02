import Button from "@/components/ui/Button";
import { ApprovalDetailResponse } from "@/types/document";
import { Edit, Printer, FileSearch } from "lucide-react";
import { SelectedDocument } from "@/types/project";
import ApproveDocument from "@/components/document/ApproveDocument";

interface Props {
    approve: ApprovalDetailResponse;
    isAttending: boolean;
    onEdit: () => void;
    onRelate: (doc: SelectedDocument) => void;
}

export default function ApprovePreview({
    approve,
    isAttending,
    onEdit,
    onRelate,
}: Props) {
    const handleClickMinute = () => {
        onRelate({ type: "minute", id: approve.minutesId });
    };

    return (
        <div className="rounded-lg shadow-sm">
            {isAttending && (
                <div className="flex rounded-t-lg flex-row gap-4 p-4 bg-white/80">
                    <Button
                        label="회의록 조회"
                        onClick={handleClickMinute}
                        variant="primary"
                        icon={<FileSearch className="w-4 h-4" />}
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
                </div>
            )}
            <div className="p-4 rounded-b-lg bg-blue-50">
                <ApproveDocument approve={approve} />
            </div>
        </div>
    );
}
