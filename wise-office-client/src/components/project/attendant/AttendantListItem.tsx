import Image from "next/image";
import { useState } from "react";

type AttendantListItemProps = {
    isPm: boolean;
    name: string;
    imageUrl: string;
};

export default function AttendantListItem({
    isPm,
    name,
    imageUrl,
}: AttendantListItemProps) {
    const [imageError, setImageError] = useState(false);

    if (isPm) {
        return (
            <div className="min-x-10 flex flex-col md:flex-row rounded-full items-center gap-2 md:gap-4">
                <div className="relative w-10 h-10 shrink-0">
                    <Image
                        src={
                            imageError || !imageUrl
                                ? "/assets/default_profile.jpg"
                                : imageUrl
                        }
                        alt="profile-image"
                        fill
                        className="object-cover rounded-full"
                        onError={() => setImageError(true)}
                    />
                    <span className="absolute -top-2.5 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 shadow-md ring-1 ring-white">
                        PM
                    </span>
                </div>

                <span className="text-xs md:text-sm font-medium text-gray-800 truncate max-w-[10rem] md:max-w-[14rem]">
                    {name}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row rounded-full items-center justify-center md:justify-start gap-2 md:gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                    src={
                        imageError || !imageUrl
                            ? "/assets/default_profile.jpg"
                            : imageUrl
                    }
                    alt="profile-image"
                    fill
                    className="object-cover rounded-full"
                    onError={() => setImageError(true)}
                />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-800">
                {name}
            </span>
        </div>
    );
}
