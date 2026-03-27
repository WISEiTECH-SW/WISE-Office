interface PagenationButtonProps {
    label: string | number;
    isNumber: boolean;
    onClick: () => void;
    isSelected?: boolean;
    isDisabled?: boolean;
}

export default function PagenationButton({
    label,
    isNumber,
    onClick,
    isSelected = false,
    isDisabled = false,
}: PagenationButtonProps) {
    const style = isNumber
        ? isSelected
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
        : "bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-0 disabled:cursor-default";

    return (
        <button
            className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${style}`}
            disabled={isDisabled}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
