import { useState } from "react";
import { Member } from "@/types/member";
import { ProjectAttendant } from "@/types/project";
import Tab from "../Tab";
import AttendantListItem from "./AttendantListItem";

type AttendantListProps = {
    pm: ProjectAttendant;
    attendants: ProjectAttendant[];
    proposalAttendant: Member[];
};

export default function AttendantList({
    pm,
    attendants,
    proposalAttendant,
}: AttendantListProps) {
    const [selectAttendant, setSelectAttendant] = useState("수행 인원");

    return (
        <div className="md:min-h-52 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 p-2 md:p-4 rounded-t-lg">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                    참여 인원
                </h3>
            </div>
            <div className="p-4 overflow-x-auto scrollbar-auto-hide">
                <Tab
                    options={["수행 인원", "편성 인원"]}
                    selectedTab={selectAttendant}
                    onTabChange={setSelectAttendant}
                />

                {selectAttendant === "수행 인원" ? (
                    <div className="flex flex-col gap-2 pt-2">
                        <div className="md:max-h-85 pt-4 flex flex-nowrap gap-4 md:flex-col">
                            <AttendantListItem
                                isPl={true}
                                name={pm.name}
                                rank={pm.rank}
                                imageUrl={pm.imageUrl}
                            />
                            {attendants.map((participant, index) => (
                                <AttendantListItem
                                    key={index}
                                    name={participant.name}
                                    rank={participant.rank}
                                    imageUrl={participant.imageUrl}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 pt-2">
                        <div className="md:max-h-85 pt-4 flex flex-nowrap gap-4 md:flex-col">
                            {[...proposalAttendant]
                                .sort((a, b) =>
                                    a.role === "PM"
                                        ? -1
                                        : b.role === "PM"
                                          ? 1
                                          : 0,
                                )
                                .map((participant, index) => (
                                    <AttendantListItem
                                        key={index}
                                        isPm={participant.role === "PM"}
                                        name={participant.name}
                                        rank={participant.rank}
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
