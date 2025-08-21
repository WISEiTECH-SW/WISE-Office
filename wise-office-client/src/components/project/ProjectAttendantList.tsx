import ProjectAttendantItem from "./ProjectAttendantItem";

type ProjectAttendantListProps = {
    attendants: string[];
};

export default function ProjectAttendantList({
    attendants,
}: ProjectAttendantListProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 px-4 py-3 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-800">참여자</h3>
            </div>
            <div className="p-4">
                <div className="space-y-3">
                    {attendants.map((participant, index) => (
                        <ProjectAttendantItem key={index} name={participant} />
                    ))}
                </div>
            </div>
        </div>
    );
}
