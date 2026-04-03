import ProfileImage from "@/components/header/ProfileImage";

type AttendantListItemProps = {
    isPm?: boolean;
    isPl?: boolean;
    name: string;
    rank: string;
    imageUrl?: string;
};

export default function AttendantListItem({
    isPm,
    isPl,
    name,
    rank,
    imageUrl,
}: AttendantListItemProps) {
    if (isPm) {
        return (
            <div className="min-w-10 flex flex-col md:flex-row rounded-full items-center gap-2 md:gap-4 pb-4">
                <div className="relative w-10 h-10 shrink-0">
                    <ProfileImage imageUrl={imageUrl} />
                    <span className="w-8 absolute -top-2.5 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-200 text-blue-800 shadow-md ring-1 ring-white text-center">
                        PM
                    </span>
                </div>

                <span className="text-xs md:text-sm font-medium text-gray-800 truncate max-w-[10rem] md:max-w-[14rem]">
                    {rank ? name + " " + rank : name}
                </span>
            </div>
        );
    }

    if (isPl) {
        return (
            <div className="min-w-10 flex flex-col md:flex-row rounded-full items-center gap-2 md:gap-4 pb-4">
                <div className="relative w-10 h-10 shrink-0">
                    <ProfileImage imageUrl={imageUrl} />
                    <span className="w-8 absolute -top-2.5 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 shadow-md ring-1 ring-white text-center">
                        PL
                    </span>
                </div>

                <span className="text-xs md:text-sm font-medium text-gray-800 truncate max-w-[10rem] md:max-w-[14rem]">
                    {rank ? name + " " + rank : name}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row rounded-full items-center justify-center md:justify-start gap-2 md:gap-4 pb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <ProfileImage imageUrl={imageUrl} />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-800">
                {rank ? name + " " + rank : name}
            </span>
        </div>
    );
}
