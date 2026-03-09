import { LogDetail } from "@/types/log";
import ProfileImage from "@/components/header/ProfileImage";
import { formatDateTime } from "@/lib/common/util";
import { Edit, Trash2 } from "lucide-react";
import Button from "@/components/common/Button";

interface LogPreviewProps {
    logDetail: LogDetail;
    onEdit: () => void;
    onDelete: () => void;
}

export default function LogPreview({
    logDetail,
    onEdit,
    onDelete,
}: LogPreviewProps) {
    return (
        <div className="flex flex-col pt-6 md:pt-6">
            <div className="px-6 md:px-8 flex justify-between items-center mb-2">
                <div className="flex gap-4 items-center text-gray-500">
                    <div className="relative w-12 h-12 rounded-full border-2 border-white">
                        <ProfileImage imageUrl={logDetail.imageUrl} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-medium">
                            {logDetail.writer}
                        </span>
                        <span className="text-sm">
                            {formatDateTime(logDetail.createdAt)}
                        </span>
                    </div>
                </div>

                {logDetail.canModify && (
                    <div className="flex ml-4 gap-2 flex-shrink-0">
                        <Button
                            label="수정"
                            onClick={onEdit}
                            variant="secondary"
                            icon={<Edit className="h-4 w-4" />}
                        />
                        <Button
                            label="삭제"
                            onClick={onDelete}
                            variant="danger"
                            icon={<Trash2 className="h-4 w-4" />}
                        />
                    </div>
                )}
            </div>

            <h2 className="p-6 md:py-4 md:px-8 text-xl md:text-2xl font-bold text-gray-800 break-words whitespace-normal border-b border-gray-200">
                {logDetail.title}
            </h2>

            <p className="p-6 md:p-8 text-gray-700 leading-relaxed break-words whitespace-pre-line border-b border-gray-200">
                {logDetail.content}
            </p>
        </div>
    );
}
