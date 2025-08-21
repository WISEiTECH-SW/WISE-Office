type ProjectInfoItemProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

export default function ProjectInfoItem({
    icon,
    label,
    value,
}: ProjectInfoItemProps) {
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
}
