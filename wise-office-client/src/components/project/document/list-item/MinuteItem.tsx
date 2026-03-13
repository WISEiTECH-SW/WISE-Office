import { MinutesListResponse } from "@/types/document";
import { DocumentType } from "@/types/project";
import { CalendarDays } from "lucide-react";

interface MinuteItemProps {
    minute: MinutesListResponse;
    isSelected: boolean;
    onSelect: (type: DocumentType, id: number) => void;
}

export default function MinuteItem({
    minute,
    isSelected,
    onSelect,
}: MinuteItemProps) {
    const handleDocSelect = () => onSelect("minute", minute.minutesId);

    return (
        <div
            onClick={handleDocSelect}
            className={`w-40 flex-none md:w-full p-4 border-r md:border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected
                    ? "bg-blue-50 border-t-4 md:border-l-4 md:border-t-0 border-t-blue-500 md:border-l-blue-500 "
                    : ""
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-sm text-gray-800 truncate">
                    {minute.title}
                </h3>
            </div>

            <div className="flex mt-2 justify-between">
                <div className="text-xs text-gray-500">{minute.writer}</div>
                <div className="flex items-center text-xs text-gray-500">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {minute.minutesAt}
                </div>
            </div>
        </div>
    );
}
