export default function LeaveTableSection() {
    const headers = [
        "휴가일자",
        "휴가구분",
        "휴가일수",
        "신청일시",
        "결재자",
        "승인구분",
        "긴급",
    ];

    return (
        <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm p-6">
            <p className="text-xl font-bold">테이블로 미리보기</p>
            <div>
                <table className="w-full border-collapse text-sm text-left my-4 md:my-8">
                    <thead className="bg-blue-50">
                        <tr>
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="md:px-4 py-2 border-b border-gray-200 text-xs sm:text-base font-semibold text-gray-700 text-center"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50 transition">
                            {headers.map((_, i) => (
                                <td
                                    key={i}
                                    className="px-4 py-2 border-b border-gray-100 text-gray-600 text-center"
                                >
                                    -
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
