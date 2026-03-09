import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import "flatpickr/dist/plugins/monthSelect/style.css";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import { Korean } from "flatpickr/dist/l10n/ko";

interface ProjectNameWithPeriodProps {
    projectTitle: string;
    institution: string;
    setInstitution: (value: string) => void;
    businessName: string;
    setBusinessName: (value: string) => void;
    startDate: string;
    endDate: string;
    content: string;
    setProjectTitle: (value: string) => void;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    setContent: (value: string) => void;
    errors: {
        projectTitle: string;
        institution: string;
        businessName: string;
        startDate: string;
        endDate: string;
        content: string;
    };
}

export default function ProjectNameWithPeriod({
    projectTitle,
    institution,
    setInstitution,
    businessName,
    setBusinessName,
    startDate,
    endDate,
    content,
    setProjectTitle,
    setStartDate,
    setEndDate,
    setContent,
    errors,
}: ProjectNameWithPeriodProps) {
    return (
        <div className="grid grid-cols-2 gap-10 w-full">
            <div className="flex flex-col basis-1/5 overflow-y-auto pr-2">
                {/* 프로젝트 명 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                        연구개발과제명
                    </label>
                    <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="border border-gray-300 rounded-md mx-1 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="과제명을 입력하세요"
                    />
                    <p className="h-2 ml-1 px-1 text-red-500 text-xs mt-1">
                        {errors.projectTitle}
                    </p>
                </div>
                {/* 사업 명 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                        사업명 (사전품의서에 기입할 세부사업명, 총괄연구과제명
                        등)
                    </label>
                    <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="border border-gray-300 rounded-md mx-1 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="사업명을 입력하세요."
                    />
                    <p className="h-2 ml-1 px-1 text-red-500 text-xs mt-1">
                        {errors.businessName}
                    </p>
                </div>
                {/* 전담기관 명 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                        전담기관
                    </label>
                    <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="border border-gray-300 rounded-md mx-1 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="전담기관을 입력하세요"
                    />
                    <p className="h-2 ml-1 px-1 text-red-500 text-xs mt-1">
                        {errors.institution}
                    </p>
                </div>
            </div>
            <div>
                {/* 프로젝트 기간 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                        프로젝트 기간
                    </label>
                    <div className="flex gap-3">
                        {/* 시작 월 */}
                        <div className="w-1/2">
                            <Flatpickr
                                options={{
                                    disableMobile: true,
                                    locale: Korean,
                                    plugins: [
                                        monthSelectPlugin({
                                            shorthand: true,
                                            dateFormat: "Y-m",
                                            altFormat: "Y년 m월",
                                            theme: "material_blue",
                                        }),
                                    ],
                                }}
                                value={startDate}
                                onChange={(dates) => {
                                    if (dates.length > 0) {
                                        const date = dates[0];
                                        setStartDate(
                                            `${date.getFullYear()}-${String(
                                                date.getMonth() + 1,
                                            ).padStart(2, "0")}`,
                                        );
                                    }
                                }}
                                className="border border-gray-300 rounded-md mx-1 px-3 py-2 w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="시작 월 선택"
                            />
                            <p className="h-2 ml-1 px-1 text-red-500 text-xs mt-1">
                                {errors.startDate}
                            </p>
                        </div>

                        <span className="self-start mt-2 text-lg font-semibold text-gray-600">
                            →
                        </span>

                        {/* 종료 월 */}
                        <div className="w-1/2">
                            <Flatpickr
                                options={{
                                    disableMobile: true,
                                    locale: Korean,
                                    plugins: [
                                        monthSelectPlugin({
                                            shorthand: true,
                                            dateFormat: "Y-m",
                                            altFormat: "Y년 m월",
                                            theme: "material_blue",
                                        }),
                                    ],
                                }}
                                value={endDate}
                                onChange={(dates) => {
                                    if (dates.length > 0) {
                                        const date = dates[0];
                                        setEndDate(
                                            `${date.getFullYear()}-${String(
                                                date.getMonth() + 1,
                                            ).padStart(2, "0")}`,
                                        );
                                    }
                                }}
                                className="border border-gray-300 rounded-md mx-1 px-3 py-2 w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="종료 월 선택"
                            />
                            <p className="h-2 ml-1 px-1 text-red-500 text-xs mt-1">
                                {errors.endDate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 내용/설명 입력 */}
                <div className="mb-5 flex-shrink-0">
                    <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                        프로젝트 설명
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border border-gray-300 rounded-md mx-1 px-3 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="프로젝트에 대한 설명을 입력하세요"
                    />
                    <p className="h-2 ml-1 px-1 text-red-500 text-xs">
                        {errors.content}
                    </p>
                </div>
            </div>
        </div>
    );
}
