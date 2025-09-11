import { useEffect, useRef } from "react";

type ConfirmModalProps = {
    deleteTarget: [string, number];
    onConfirm: (id: number) => void;
    onClose: () => void;
};

export default function ConfirmModal({
    deleteTarget,
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const getMessage = () => {
        switch (deleteTarget[0]) {
            case "project":
                return ["프로젝트를", "프로젝트는"];
            case "log":
                return ["로그를", "로그는"];
            case "comment":
                return ["댓글을", "댓글은"];
            default:
                return ["", ""];
        }
    };

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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="Overlay fixed inset-0 bg-[rgba(43,43,43,0.1)] bg-opacity-40 flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl p-5 w-[30%] max-w-[64rem] max-h-[90vh] flex flex-col gap-5 relative mb-10"
            >
                <div className="flex flex-col gap-3">
                    <p className="text-lg">
                        {`⚠️ ${getMessage()[0]} 삭제하시겠습니까?`}
                    </p>
                    <p className="text-sm text-gray-700">
                        {`삭제한 ${getMessage()[1]} 복구할 수 없습니다.`}
                    </p>
                </div>
                <div className="flex flex-row-reverse gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onConfirm(deleteTarget[1])}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 cursor-pointer"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
