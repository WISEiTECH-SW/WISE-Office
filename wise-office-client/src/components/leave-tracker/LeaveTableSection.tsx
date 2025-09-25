import type { Row } from "@/types/annualLeave";

type DataProps = {
    data: Row[];
};

export default function LeaveTableSection({ data }: DataProps) {
    const headers = [
        "휴가일자",
        "휴가구분",
        "휴가일수",
        "신청일시",
        "결재자",
        "승인구분",
        "긴급",
    ];
    const colWidths = [
        "w-[30%]",
        "w-[10%]",
        "w-[10%]",
        "w-[20%]",
        "w-[10%]",
        "w-[10%]",
        "w-[10%]",
    ];

    return (
        <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm p-8">
            <p className="text-xl font-bold">테이블로 미리보기</p>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm text-left my-4 md:my-6 ">
                    <colgroup>
                        {colWidths.map((w, i) => (
                            <col key={i} className={w} />
                        ))}
                    </colgroup>
                    <thead className="bg-blue-50">
                        <tr>
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="md:px-4 py-2 border-b border-gray-300 text-xs sm:text-base font-semibold text-gray-700 text-center"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                <td className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center">
                                    {row.date}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center">
                                    {row.category}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center">
                                    {row.days}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center">
                                    {row.requestedAt}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center">
                                    {row.approver}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center">
                                    {row.status}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center">
                                    {row.flag}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
