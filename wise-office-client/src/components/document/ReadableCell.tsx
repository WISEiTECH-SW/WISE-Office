interface ReadableCellProps {
    colSpan: number;
    value: string;
    textAlign?: string;
}

export function ReadableCell({
    colSpan = 1,
    value,
    textAlign,
}: ReadableCellProps) {
    return (
        <td
            colSpan={colSpan}
            className={`border border-black px-2 ${textAlign ? "text-start" : "text-center"}`}
        >
            <p className="font-normal leading-snug">{value}</p>
        </td>
    );
}
