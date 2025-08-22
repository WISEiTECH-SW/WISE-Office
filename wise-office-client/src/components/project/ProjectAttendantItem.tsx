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
            <Image
                src={imageUrl}
                alt="profile image"
                width={32}
                height={32}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
            ></Image>
            <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
    );
}
