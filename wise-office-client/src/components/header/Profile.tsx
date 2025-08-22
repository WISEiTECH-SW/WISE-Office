import { useRouter } from "next/router";
import Image from "next/image";
import { useProfileStore } from "@/store/useProfileStore";

export default function Profile() {
    const router = useRouter();
    const { profile } = useProfileStore();

    const handleProfileClick = () => {
        router.push("/account");
    };

    return (
        <div
            onClick={handleProfileClick}
            className="rounded-full border border-white bg-white shadow-sm hover:bg-gray-100 cursor-pointer"
        >
            <Image
                src={profile?.imageUrl ?? "/assets/Google.png"}
                alt={profile?.name ?? "👤"}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
            />
        </div>
    );
}
