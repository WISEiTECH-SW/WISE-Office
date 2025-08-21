import { User } from "lucide-react";

type ProjectAttendantItemProps = {
    name: string;
    imgUrl: string;
};

export default function ProjectAttendantItem({
    name,
    imgUrl,
}: ProjectAttendantItemProps) {
    const profileImg = `${imgUrl}/assets/Google.png`;
    return (
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
            </div>
            {/* <img
                src={profileImg}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
            ></img> */}
            <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
    );
}
