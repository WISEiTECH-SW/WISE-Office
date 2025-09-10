import { useState } from "react";
import Image from "next/image";
import { useProfileStore } from "@/store/useProfileStore";

type ProfileImageProps = {
    type: string;
};

export default function ProfileImage({ type }: ProfileImageProps) {
    const { profile } = useProfileStore();
    const [imageError, setImageError] = useState(false);

    const image_size = type === "header" ? 36 : 96;

    return (
        <Image
            src={
                imageError || !profile?.imageUrl
                    ? "/assets/default_profile.jpg"
                    : profile.imageUrl
            }
            alt=""
            width={image_size}
            height={image_size}
            className="w-full h-full object-cover rounded-full"
            onError={() => setImageError(true)}
        />
    );
}
