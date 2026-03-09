export function LabelCell({ label }: { label: string }) {
    return (
        <td className="border border-black px-[10px] py-2 bg-gray-300 font-semibold text-center whitespace-nowrap text-black text-[14px] align-middle">
            {label}
        </td>
    );
}
