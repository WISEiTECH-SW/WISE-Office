import React from "react";
import ProjectParticipantItem from "./projectParticipantItem";

// 참여자 목록 컴포넌트의 props 타입을 정의합니다.
// 참여자 이름의 배열을 받습니다.
interface ProjectParticipantsProps {
    participants: string[];
}

const ProjectParticipants: React.FC<ProjectParticipantsProps> = ({
    participants,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 px-4 py-3 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-800">참여자</h3>
            </div>
            <div className="p-4">
                <div className="space-y-3">
                    {participants.map((participant, index) => (
                        // 분리된 ProjectParticipantItem 컴포넌트 사용
                        <ProjectParticipantItem
                            key={index}
                            name={participant}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectParticipants;
