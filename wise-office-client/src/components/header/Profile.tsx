import { useRouter } from "next/router";
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
            <img
                src={profile?.imageUrl ?? "/assets/Google.png"}
                alt={profile?.name ?? "👤"}
                className="w-9 h-9 rounded-full object-cover"
            />
        </div>
    );
}
