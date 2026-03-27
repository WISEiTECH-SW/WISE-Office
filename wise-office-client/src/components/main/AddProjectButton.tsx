import { Plus } from "lucide-react";

type AddProjectButtonProps = {
    onClick: () => void;
};

export default function AddProjectButton({ onClick }: AddProjectButtonProps) {
    return (
        <button
            className="px-4 py-2 text-m font-medium text-white flex items-center bg-blue-500 shadow-m hover:bg-blue-600 rounded-md text-center gap-2 cursor-pointer"
            onClick={onClick}
        >
            <Plus className="w-5 h-5" />
            <p className="hidden md:block">프로젝트 생성</p>
        </button>
    );
}
