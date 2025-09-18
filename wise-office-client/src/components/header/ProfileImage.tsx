import { useState } from "react";
import Image from "next/image";

type ProfileImageProps = {
    imageUrl?: string;
};

export default function ProfileImage({ imageUrl }: ProfileImageProps) {
    const [imageError, setImageError] = useState(false);

    return (
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
    );
}
