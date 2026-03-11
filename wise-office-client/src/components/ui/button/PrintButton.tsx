import { Printer } from "lucide-react";

export default function PrintButton() {
    const onPrint = () => {
        window.print();
    };

    return (
        <button
            onClick={onPrint}
            className="flex border border-gray-400 rounded-md p-1 items-center bg-background-default hover:bg-gray-200 cursor-pointer"
        >
            <Printer size={12} strokeWidth={1} />
            <p className="text-xs px-1">인쇄</p>
        </button>
    );
}
