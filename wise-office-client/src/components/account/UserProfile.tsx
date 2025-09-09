import { Profile } from "@/types/profile";
import Image from "next/image";
interface UserProfileProps {
    props: Profile;
}

export default function UserProfile({ props }: UserProfileProps) {
    return (
        <div className="flex flex-col items-center">
            <Image
                className="w-24 h-24 rounded-full bg-gray-300 object-cover"
                src={props.imageUrl ?? "assets/default_profile.jpg"}
                width={48}
                height={48}
                alt=""
            />
            <p className="mt-3 font-semibold">{props.name}</p>
        </div>
    );
}
