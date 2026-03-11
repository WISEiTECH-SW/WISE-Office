import { useEffect, useRef } from "react";
import { DeleteModalState, DeleteModalType } from "@/types/project";
import Button from "../common/Button";

interface DeleteModalProps {
    deleteTarget: DeleteModalState;
    onDelete: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

const messageMap: Record<
    DeleteModalType,
    { target: string; particle: string }
> = {
    project: { target: "프로젝트를", particle: "프로젝트는" },
    log: { target: "로그를", particle: "로그는" },
    comment: { target: "댓글을", particle: "댓글은" },
    minute: { target: "회의록을", particle: "회의록은" },
    approve: { target: "결재 문서를", particle: "결재 문서는" },
};

export default function DeleteModal({
    deleteTarget,
    onDelete,
    onClose,
    isLoading = false,
}: DeleteModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!deleteTarget) return null;

    const { target, particle } = messageMap[deleteTarget.type];

    return (
        <div className="Overlay fixed inset-0 bg-[rgba(43,43,43,0.1)] bg-opacity-40 flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl p-5 w-[75%] md:w-[30%] max-w-[64rem] max-h-[90vh] flex flex-col gap-5 relative mb-10"
            >
                <div className="flex flex-col gap-3">
                    <p className="text-lg font-medium">
                        {`⚠️ ${target} 삭제하시겠습니까?`}
                    </p>
                    <p className="text-sm text-gray-700">
                        {`삭제한 ${particle} 복구할 수 없습니다.`}
                    </p>
                </div>

                <div className="flex flex-row-reverse gap-2">
                    <Button
                        label="취소"
                        onClick={onClose}
                        variant="secondary"
                        isLoading={isLoading}
                    />
                    <Button
                        label="삭제"
                        onClick={onDelete}
                        variant="primary"
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
