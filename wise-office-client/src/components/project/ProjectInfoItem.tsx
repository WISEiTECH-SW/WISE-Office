import React from "react";

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
