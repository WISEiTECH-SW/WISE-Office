import React from "react";
import { User } from "lucide-react";

// 참여자 아이템의 props 타입을 정의합니다.
// 이 예시에서는 참여자의 이름을 받습니다.
interface ProjectParticipantItemProps {
    name: string;
}

const ProjectParticipantItem: React.FC<ProjectParticipantItemProps> = ({
    name,
}) => {
    return (
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
    );
};

export default ProjectParticipantItem;
