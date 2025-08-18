import React from "react";

// children prop을 아이콘 컴포넌트로 받기 위한 타입 정의
// lucide-react 컴포넌트도 React.ReactNode 타입에 해당합니다.
interface ProjectInfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const ProjectInfoItem: React.FC<ProjectInfoItemProps> = ({
    icon,
    label,
    value,
}) => {
    return (
        <div className="flex items-center space-x-3">
            {/* 이제 icon prop은 직접 전달된 아이콘 컴포넌트입니다. */}
            {icon}
            <div>
                <div className="text-sm font-medium text-gray-600">{label}</div>
                <div className="text-base font-semibold text-gray-800">
                    {value}
                </div>
            </div>
        </div>
    );
};

export default ProjectInfoItem;
