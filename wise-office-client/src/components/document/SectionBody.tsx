import { autoResizeTextarea } from "@/utils/textArea";

interface SectionBodyProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SectionBody({
    placeholder,
    value,
    onChange,
    className = "",
}: SectionBodyProps) {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                autoResizeTextarea(e);
                onChange(e.target.value);
            }}
            className={`w-full border border-t-0 border-black p-4 text-sm leading-relaxed 
            text-slate-800 resize-none overflow-hidden focus:outline-none ${className}`}
        />
    );
}
