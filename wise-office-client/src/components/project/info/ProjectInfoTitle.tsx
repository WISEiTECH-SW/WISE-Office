interface ProjectInfoTitleProps {
    state: string; //"진행전" | "진행중" | "종료됨";
    duration: string;
    title: string;
}

export default function ProjectInfoTitle({
    state,
    duration,
    title,
}: ProjectInfoTitleProps) {
    const config: Record<string, { badge: string; dot: string }> = {
        진행전: {
            badge: "bg-yellow-100 text-yellow-800",
            dot: "bg-yellow-400 animate-pulse",
        },
        진행중: {
            badge: "bg-green-100 text-green-800",
            dot: "bg-green-500 animate-pulse",
        },
        종료됨: {
            badge: "bg-gray-100 text-gray-600",
            dot: "bg-gray-400",
        },
    };

    const { badge, dot } = config[state];

    return (
        <div className="flex items-center gap-2.5 flex-wrap">
            <span
                className={`inline-flex items-center gap-2 px-2 py-1 font-semibold rounded-md shrink-0 ${badge}`}
            >
                <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                {duration}
            </span>
            <p className="text-lg md:text-2xl font-bold text-gray-800 break-words whitespace-normal">
                {title}
            </p>
        </div>
    );
}
