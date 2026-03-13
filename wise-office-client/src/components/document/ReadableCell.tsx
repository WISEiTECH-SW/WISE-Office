interface ReadableCellProps {
    colSpan: number;
    value: string;
}

export function ReadableCell({ colSpan = 1, value }: ReadableCellProps) {
    return (
        <td colSpan={colSpan} className={`border border-black p-2`}>
            <div className="flex items-center w-full">
                <textarea
                    value={value}
                    rows={1}
                    className={`w-full resize-none bg-transparent font-medium focus:outline-none leading-snug py-2`}
                />
            </div>
        </td>
    );
}
