import Image from "next/image";
import { useState } from "react";

type ProjectAttendantItemProps = {
    isPm: boolean;
    name: string;
    imageUrl: string;
};

export default function ProjectAttendantItem({
    isPm,
    name,
    imageUrl,
}: ProjectAttendantItemProps) {
    const [imageError, setImageError] = useState(false);

    if (isPm) {
        return (
            <div className="min-x-10 flex flex-col md:flex-row rounded-full items-center gap-1 md:gap-3">
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
                <span className="text-xs md:text-sm font-medium text-gray-800 truncate">
                    {name}
                </span>
                {/* <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                    PM
                </span> */}
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row rounded-full items-center justify-center md:justify-start gap-1 md:gap-3">
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
