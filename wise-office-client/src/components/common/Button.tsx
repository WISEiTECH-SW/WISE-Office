interface ButtonProps {
    label: string;
    onClick: () => void;
    variant: "primary" | "secondary" | "danger";
    icon?: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
}

export default function Button({
    label,
    onClick,
    variant,
    icon,
    isLoading = false,
    disabled = false,
}: ButtonProps) {
    const variantStyles = {
        primary: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300",
        secondary: "bg-gray-400 hover:bg-gray-500 disabled:opacity-50",
        danger: "bg-red-400 hover:bg-red-500 disabled:bg-red-300",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
        flex items-center justify-center gap-2
        px-4 py-2 text-white text-sm rounded-md transition-colors
        cursor-pointer disabled:cursor-not-allowed
        ${variantStyles[variant]}
        `}
        >
            {!isLoading && icon && <span className="w-4 h-4">{icon}</span>}

            <span>{isLoading ? `${label} 중...` : label}</span>
        </button>
    );
}
