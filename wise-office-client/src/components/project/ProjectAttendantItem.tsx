import Image from "next/image";
import { useState } from "react";

type ProjectAttendantItemProps = {
    name: string;
    imageUrl: string;
};

export default function ProjectAttendantItem({
    name,
    imageUrl,
}: ProjectAttendantItemProps) {
    const [imageError, setImageError] = useState(false);

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
