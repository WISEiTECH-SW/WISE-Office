import { useProfileStore } from "@/store/useProfileStore";

export default function Profile() {
    const { profile } = useProfileStore();

    return (
        <a
            href="/account"
            className="rounded-full border border-gray-300 p-1 bg-white shadow-sm hover:bg-gray-100 cursor-pointer"
        >
            <img
                src={profile?.imageUrl ?? "/assets/Google.png"}
                alt={profile?.name ?? "👤"}
                className="w-9 h-9 rounded-full object-cover"
            />
        </a>
    );
}
