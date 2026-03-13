interface ReadableCellProps {
    colSpan: number;
    value: string;
    style?: string;
}

export function ReadableCell({ colSpan = 1, value, style }: ReadableCellProps) {
    return (
        <td
            colSpan={colSpan}
            className={`border border-black px-2 ${style ? "text-start" : "text-center"}`}
        >
            <p className="font-normal leading-snug">{value}</p>
        </td>
    );
}
