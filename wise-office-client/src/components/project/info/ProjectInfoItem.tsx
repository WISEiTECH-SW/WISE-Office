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
        <div className="flex items-start space-x-3 gap-2">
            <div className="text-blue-600 mt-2 md:w-6 md:h-6">{icon}</div>

            <div className="flex-grow min-w-0">
                <div className="text-xs md:text-sm font-semibold text-gray-600">
                    {label}
                </div>
                <div className="text-sm md:text-base font-medium text-gray-800 break-words whitespace-normal">
                    {value}
                </div>
            </div>
        </div>
    );
}
