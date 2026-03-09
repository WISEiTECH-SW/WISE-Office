import { X } from "lucide-react";

export default function Buttonbar({
    position,
    modalWidth,
    onClose,
}: {
    position: string;
    modalWidth: number;
    onClose?: () => void;
}) {
    return (
        <div
            style={{ width: modalWidth }}
            className={`h-8 bg-background-default flex flex-row-reverse p-2 text-xs
                ${position === "top" ? "rounded-t-xl border-b" : "rounded-b-xl border-t"} border-gray-200`}
        >
            <button
                onClick={onClose}
                className="px-2 flex items-center cursor-pointer"
            >
                {position === "top" ? <X size={20} color="gray" /> : "출력"}
            </button>
        </div>
    );
}
