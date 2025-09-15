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
            <div className="flex items-center bg-blue-100 rounded-full space-x-3">
                <div className="relative w-10 h-10 rounded-full">
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
                <span className="text-sm font-medium text-gray-800">
                    {name}
                </span>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                    PM
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full">
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
            <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
    );
}
