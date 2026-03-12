export function LabelCell({ label }: { label: string }) {
    const characters = label.split("");

    return (
        <td className="border border-black px-[10px] py-2 bg-gray-300 font-semibold text-black text-[14px] align-middle">
            <div className="flex justify-between w-full">
                {characters.map((char, index) => (
                    <span key={index}>{char}</span>
                ))}
            </div>
        </td>
    );
}
