import { LucideFileSearch } from "lucide-react";

export default function PreviewButton() {
    return (
        <button className="flex border border-gray-400 rounded-md p-1 items-center bg-background-default hover:bg-gray-200 cursor-pointer">
            <LucideFileSearch size={12} strokeWidth={1} />
            <p className="text-xs px-1">미리보기</p>
        </button>
    );
}
