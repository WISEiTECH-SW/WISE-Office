export function EditableCell({
    placeholder,
    colSpan,
}: {
    placeholder: string;
    colSpan?: number;
}) {
    return (
        <td
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            colSpan={colSpan}
            className="border border-black px-[10px] py-2 align-middle text-[13.5px] min-h-[32px] focus:outline-none focus:bg-blue-50"
        />
    );
}
