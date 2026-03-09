export function SectionBody({
    placeholder,
    className = "",
}: {
    placeholder: string;
    className?: string;
}) {
    return (
        <div
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            className={`border border-t-0 border-black p-4 text-sm leading-relaxed text-slate-800 focus:outline-none focus:bg-blue-50 ${className}`}
        />
    );
}
