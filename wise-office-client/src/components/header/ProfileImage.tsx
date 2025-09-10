import { useState } from "react";
import Image from "next/image";
import { useProfileStore } from "@/store/useProfileStore";

export default function ProfileImage() {
    const { profile } = useProfileStore();
    const [imageError, setImageError] = useState(false);

    return (
        <Image
            src={
                imageError || !profile?.imageUrl
                    ? "/assets/default_profile.jpg"
                    : profile.imageUrl
            }
            alt="profile-image"
            fill
            className="object-cover rounded-full"
            onError={() => setImageError(true)}
        />
    );
}
