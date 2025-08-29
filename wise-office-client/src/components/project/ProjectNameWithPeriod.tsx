import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

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
        <div className="flex flex-col basis-1/5 overflow-y-auto pr-4">
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
                    {/* 시작 월 */}
                    <Flatpickr
                        options={{
                        plugins: [monthSelectPlugin({
                            shorthand: true,
                            dateFormat: "Y-m",
                            altFormat: "Y년 m월",
                            theme: "material_blue",
                        })],
                        // defaultDate: startDate || null,
                        }}
                        value={startDate}
                        onChange={(dates) => {
                        if (dates.length > 0) {
                            const date = dates[0];
                            setStartDate(
                            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
                            );
                        }
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 w-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="시작 월 선택"
                    />

                    <span className="self-center text-lg font-semibold text-gray-600">→</span>

                    {/* 종료 월 */}
                    <Flatpickr
                        options={{
                        plugins: [monthSelectPlugin({
                            shorthand: true,
                            dateFormat: "Y-m",
                            altFormat: "Y년 m월",
                            theme: "material_blue",
                        })],
                        // defaultDate: endDate || null,
                        }}
                        value={endDate}
                        onChange={(dates) => {
                        if (dates.length > 0) {
                            const date = dates[0];
                            setEndDate(
                            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
                            );
                        }
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 w-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="종료 월 선택"
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