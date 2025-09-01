import { toastMessage } from "@/lib/common/toastMessage";
import { deleteProjectApi } from "@/services/projects";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

type ProjectDeleteModalProps = {
    projectId: number;
    onClose: () => void;
};

export default function ConfirmModal({
    projectId,
    onClose,
}: ProjectDeleteModalProps) {
    const router = useRouter();
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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const delProject = () => {
        if (!router.isReady) return;
        if (isNaN(projectId)) return;
        try {
            deleteProjectApi(projectId);
            toastMessage.success("프로젝트가 삭제되었습니다.");
            // onClose();
            router.push("/");
        } catch (error) {
            console.log("프로젝트 삭제 실패: ", error);
        }
    };

    return (
        <div className="Overlay fixed inset-0 bg-[rgba(0,0,0,0.1)] bg-opacity-40 flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl p-5 w-[30%] max-w-[64rem] max-h-[90vh] flex flex-col gap-5 relative"
            >
                <div className="flex flex-col gap-3">
                    <p className="text-lg">⚠️ 삭제하시겠습니까?</p>
                    <p className="text-sm text-gray-700">
                        삭제한 프로젝트는 복구할 수 없습니다.
                    </p>
                </div>
                <div className="flex flex-row-reverse gap-5">
                    <button
                        onClick={delProject}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 cursor-pointer"
                    >
                        삭제
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 cursor-pointer"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
