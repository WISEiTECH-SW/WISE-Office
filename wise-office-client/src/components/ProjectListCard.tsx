export default function ProjectListCard() {
    return (
        <a
            href="/project?id=1"
            className="block w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
            {/* project-card-header */}
            <div className="px-10 py-7 border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <h5 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Project Name #01
                        </h5>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                        진행중
                    </span>
                </div>
            </div>

            {/* project-card-content */}
            <div className="px-10 py-4 pb-7">
                <div className="grid grid-cols-5 gap-8">
                    {/* content-left-column */}
                    <div className="col-span-2 space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                프로젝트 기간
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-700 gap-3">
                                <span className="font-medium">2024.01.01</span>
                                <div className="w-[15%] h-px bg-gray-300"></div>
                                <span className="font-medium">2027.12.31</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                총 기간
                            </span>
                            <p className="text-sm text-gray-600 font-medium">
                                4년 프로젝트
                            </p>
                        </div>
                    </div>

                    {/* content-right-column */}
                    <div className="col-span-3 space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                프로젝트 매니저
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 font-medium">
                                    USER_01
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    참여 인원
                                </span>
                            </div>
                            <div className="flex -space-x-1 gap-3">
                                <span className="text-sm text-gray-700 font-medium">
                                    USER_02
                                </span>
                                <span className="text-sm text-gray-700 font-medium">
                                    USER_03
                                </span>
                                <span className="text-sm text-gray-700 font-medium">
                                    USER_04
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Effect Indicator */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </a>
    );
}
