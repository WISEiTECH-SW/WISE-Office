interface SideBarItemProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    isDisabled: boolean;
    onClick: () => void;
}

export default function SidebarItem({
    label,
    icon,
    isActive,
    isDisabled,
    onClick,
}: SideBarItemProps) {
    return (
        <button
            onClick={!isDisabled ? onClick : undefined}
            disabled={isDisabled}
            className={[
                "w-full flex items-center gap-3 px-3 py-3 text-sm text-left transition-all duration-150 border-l-[3px]",
                isDisabled
                    ? "cursor-not-allowed opacity-50 bg-slate-50 border-transparent text-slate-400"
                    : isActive
                      ? "cursor-pointer bg-blue-50 border-blue-500 text-blue-800 font-semibold"
                      : "cursor-pointer border-transparent text-slate-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800",
            ].join(" ")}
        >
            <span
                className={
                    isDisabled
                        ? "text-slate-300"
                        : isActive
                          ? "text-blue-500"
                          : "text-blue-300"
                }
            >
                {icon}
            </span>
            {label}
        </button>
    );
}
