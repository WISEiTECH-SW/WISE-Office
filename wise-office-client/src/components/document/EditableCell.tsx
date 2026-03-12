import { autoResizeTextarea } from "@/utils/textArea";

interface EditableCellProps {
    placeholder: string;
    colSpan?: number;
    value: string;
    onChange: (value: string) => void;
}

export function EditableCell({
    placeholder,
    colSpan = 1,
    value,
    onChange,
}: EditableCellProps) {
    return (
        <td colSpan={colSpan} className="border border-black px-2">
            <div className="flex items-center w-full">
                <textarea
                    placeholder={placeholder}
                    value={value}
                    rows={1}
                    onChange={(e) => {
                        autoResizeTextarea(e);
                        onChange(e.target.value);
                    }}
                    className="w-full resize-none bg-transparent text-sm focus:outline-none leading-snug py-2"
                />
            </div>
        </td>
    );
}
