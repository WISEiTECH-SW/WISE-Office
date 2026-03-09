import PrintButton from "@/components/ui/button/PrintButton";
import { X } from "lucide-react";

export default function Buttonbar({
    position,
    modalWidth,
    onClose,
}: {
    position: "top" | "bottom";
    modalWidth: number;
    onClose?: () => void;
}) {
    return (
        <div
            style={{ width: modalWidth }}
            className={`h-10 bg-background-default flex flex-row-reverse p-2 text-xs
                ${position === "top" ? "rounded-t-xl border-b" : "rounded-b-xl border-t"} border-gray-200`}
        >
            {position === "top" ? (
                <button
                    onClick={onClose}
                    className="px-2 flex items-center cursor-pointer"
                >
                    <X size={20} color="gray" />
                </button>
            ) : (
                <PrintButton />
            )}
        </div>
    );
}
