export default function ApprovalSeal() {
    const labels = ["담당", "과제책임자", "대표자"];

    return (
        <div className="flex justify-end mb-4">
            <table className="border-collapse border border-black text-[12px]">
                <tbody>
                    <tr>
                        {labels.map((label, index) => (
                            <td
                                key={index}
                                className="border border-black w-[70px] text-center align-middle bg-white"
                            >
                                {label}
                            </td>
                        ))}
                    </tr>

                    <tr>
                        {labels.map((_, index) => (
                            <td
                                key={index}
                                className="border border-black h-[40px] text-center align-middle bg-white"
                            ></td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
