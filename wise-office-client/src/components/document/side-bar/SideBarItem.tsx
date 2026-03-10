interface SideBarItemProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

export default function SidebarItem({
    label,
    icon,
    isActive,
    onClick,
}: SideBarItemProps) {
    return (
        <button
            onClick={onClick}
            className={[
                "w-full flex items-center gap-3 px-3 py-3 text-sm text-left transition-all duration-150 border-l-[3px] cursor-pointer",
                isActive
                    ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold"
                    : "border-transparent text-slate-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800",
            ].join(" ")}
        >
            <span className={isActive ? "text-blue-500" : "text-blue-300"}>
                {icon}
            </span>
            {label}
        </button>
    );
}
