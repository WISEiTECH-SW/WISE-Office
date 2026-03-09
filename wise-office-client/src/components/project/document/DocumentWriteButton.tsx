import { Pen } from "lucide-react";

interface DocumentWriteButtonProps {
    label: string;
    onClick: () => void;
}

export default function DocumentWriteButton({
    label,
    onClick,
}: DocumentWriteButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full py-2 mt-4 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center justify-center gap-1 cursor-pointer"
        >
            <Pen className="w-4 h-4" />
            {label}
        </button>
    );
}
