import { useRef, useState } from "react";
import Image from "next/image";
import { Profile } from "@/types/profile";
import { updateProfileImage } from "@/services/members";
import { toastMessage } from "@/lib/common/toastMessage";
import { useProfileStore } from "@/store/useProfileStore";
import ProfileImage from "../header/ProfileImage";

interface UserProfileProps {
    props: Profile;
}

export default function UserProfile({ props }: UserProfileProps) {
    const [, setProfileImage] = useState(props.imageUrl);
    const { profile, setProfile } = useProfileStore();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const res = await updateProfileImage(file);
            setProfileImage(res);
            setProfile({
                ...(profile ?? props),
                imageUrl: res,
            });
            toastMessage.success("프로필 이미지가 변경되었습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative">
                <div className="w-36 h-36 rounded-full border-2 border-white">
                    <ProfileImage />
                </div>
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-300 cursor-pointer shadow"
                >
                    <Image
                        src="/assets/camera.png"
                        alt="camera-button"
                        width={24}
                        height={24}
                    />
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <p className="mt-3 font-semibold">{props.name}</p>
        </div>
    );
}
