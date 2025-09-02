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
            <div className="text-blue-600">{icon}</div>

            <div className="">
                <div className="text-sm font-semibold text-gray-600">
                    {label}
                </div>
                <div className="font-medium text-gray-800">{value}</div>
            </div>
        </div>
    );
}
