interface ProjectNameWithPeriodProps {
    projectTitle: string;
    startDate: string;
    endDate: string;
    content: string;
    setProjectTitle: React.Dispatch<React.SetStateAction<string>>;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProjectNameWithPeriod({projectTitle, startDate, endDate, content, setProjectTitle, setStartDate, setEndDate, setContent}:ProjectNameWithPeriodProps) {
    return (
    <div>
        <div className="flex flex-col flex-1 overflow-y-auto pr-4">
              {/* 프로젝트 명 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">
                        프로젝트 명
                    </label>
                    <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="프로젝트 명을 입력하세요"
                    />
                </div>

              {/* 프로젝트 기간 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">
                        프로젝트 기간
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="month"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        />
                        <span className="self-center text-lg font-semibold text-gray-600">→</span>
                        <input
                            type="month"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        />
                    </div>
                </div>
            {/* 내용/설명 입력 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">
                        프로젝트 설명
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="프로젝트에 대한 설명을 입력하세요"
                    />
                </div>
            </div>
    </div>
    );
}