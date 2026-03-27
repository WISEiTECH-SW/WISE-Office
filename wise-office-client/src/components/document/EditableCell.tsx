import { autoResizeTextarea, resizeTextarea } from "@/utils/textArea";
import { useEffect, useRef } from "react";

interface EditableCellProps {
    placeholder: string;
    colSpan?: number;
    value: string;
    onChange: (value: string) => void;
    editableClass?: string;
}

export function EditableCell({
    placeholder,
    colSpan = 1,
    value,
    onChange,
    editableClass = "",
}: EditableCellProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            resizeTextarea(textareaRef.current);
        }
    }, [value]);
    return (
        <td colSpan={colSpan} className="border border-black px-2">
            <div className="flex items-center w-full">
                <textarea
                    ref={textareaRef}
                    placeholder={placeholder}
                    value={value}
                    rows={1}
                    onChange={(e) => {
                        autoResizeTextarea(e);
                        onChange(e.target.value);
                    }}
                    className={`w-full resize-none text-sm leading-snug py-2 outline-none ${editableClass}`}
                />
            </div>
        </td>
    );
}
