import { Profile } from "@/types/profile";
import Image from "next/image";
interface UserProfileProps{
    props:Profile;
}

export default function UserProfile({props}:UserProfileProps) {
    return (
    <div className="flex flex-col items-center">
        <Image
        className="w-24 h-24 rounded-full bg-gray-300 object-cover"
        src={props.imageUrl ?? "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"}
        width={24}
        height={24}
        alt=""
        />
        <p className="mt-3 font-semibold">{props.name}</p>
    </div>
    );
}