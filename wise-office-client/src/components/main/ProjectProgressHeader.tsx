import AddProjectButton from "./AddProjectButton";

interface ProjectProgressHeaderProps {
    totalCount: number;
    isLogedIn: boolean;
    onClick: () => void;
}

export default function ProjectProgressHeader({
    totalCount,
    isLogedIn,
    onClick,
}: ProjectProgressHeaderProps) {
    return (
        <div className="flex w-full items-center justify-between">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-left">
                    프로젝트 진행 현황
                </h2>
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2 w-2 rounded-full animate-pulse ${
                            totalCount <= 0 ? "bg-yellow-500" : "bg-emerald-500"
                        }`}
                    />
                    <span className="text-sm text-slate-700">
                        현재 <b className="text-slate-900">{totalCount}</b> 개
                        프로젝트 진행중{" "}
                    </span>
                </div>
            </div>
            {isLogedIn && <AddProjectButton onClick={onClick} />}
        </div>
    );
}
