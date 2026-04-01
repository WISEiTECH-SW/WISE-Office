type dataType = "main" | "member" | "project" | "log" | "minute" | "approve";

interface LoadingIndicatorProps {
    type: dataType;
}

export default function LoadingIndicator({ type }: LoadingIndicatorProps) {
    const dataTypeLabel: Record<dataType, string[]> = {
        main: ["프로젝트", "프로젝트 진행 현황을"],
        member: ["사용자", "사용자 정보를"],
        project: ["프로젝트", "문서와 참여자 정보를"],
        log: ["로그", "로그와 댓글을"],
        minute: ["회의록", "회의 내역과 관련 품의서를"],
        approve: ["품의서", "품의 내역과 관련 회의록을"],
    };

    return (
        <div className="md:px-6">
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-sm px-10 py-12 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
                    <div className="text-center">
                        <p className="text-base font-semibold text-gray-800">
                            {`${dataTypeLabel[type][0]} 불러오는 중`}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {`${dataTypeLabel[type][1]} 준비하고 있습니다.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
