import ProjectAttendantItem from "./ProjectAttendantItem";
import { ProjectAttendant } from "@/types/project";

type ProjectAttendantListProps = {
    pm: ProjectAttendant;
    attendants: ProjectAttendant[];
};

export default function ProjectAttendantList({
    pm,
    attendants,
}: ProjectAttendantListProps) {
    return (
        <div className="md:min-h-52 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 p-2 md:p-4 rounded-t-lg">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                    참여자
                </h3>
            </div>
            <div className="p-4 pt-6 overflow-x-auto scrollbar-auto-hide">
                <div className="md:max-h-85 flex flex-nowrap gap-4 md:flex-col">
                    <ProjectAttendantItem
                        isPm={true}
                        name={pm.name}
                        imageUrl={pm.imageUrl}
                    />
                    {attendants.map((participant, index) => (
                        <ProjectAttendantItem
                            key={index}
                            isPm={false}
                            name={participant.name}
                            imageUrl={participant.imageUrl}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
