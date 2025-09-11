import Image from "next/image";

type ProjectAttendantItemProps = {
    name: string;
    imageUrl: string;
};

export default function ProjectAttendantItem({
    name,
    imageUrl,
}: ProjectAttendantItemProps) {
    return (
        <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full">
                <Image
                    src={imageUrl ? imageUrl : "/assets/default_profile.jpg"}
                    alt="profile-image"
                    fill
                    className="object-cover rounded-full"
                />
            </div>
            <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
    );
}
