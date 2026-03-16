interface ReadableCellProps {
    colSpan: number;
    value: string;
    textAlign?: string;
    preWrap?: boolean;
}

export function ReadableCell({
    colSpan = 1,
    value,
    textAlign,
    preWrap = false,
}: ReadableCellProps) {
    return (
        <td
            colSpan={colSpan}
            className={`border border-black px-2 ${textAlign ? "text-start" : "text-center"} ${preWrap ? "whitespace-pre-wrap" : ""}`}
        >
            <p className="font-normal leading-snug">{value}</p>
        </td>
    );
}
