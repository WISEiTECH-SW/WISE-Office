import { User } from "lucide-react";

type ProjectAttendantItemProps = {
    name: string;
};

export default function ProjectAttendantItem({
    name,
}: ProjectAttendantItemProps) {
    return (
        <div className="flex items-center space-x-3">
            {/* google 이미지 수정 필요 */}
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
    );
}
