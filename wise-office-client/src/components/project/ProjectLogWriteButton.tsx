import { Pen } from "lucide-react";

interface ProjectLogWriteButtonProps {
    onClick: () => void;
}

export default function ProjectLogWriteButton({
    onClick,
}: ProjectLogWriteButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center justify-center gap-1 cursor-pointer"
        >
            <Pen className="w-4 h-4" />
            로그 작성
        </button>
    );
}
