import MenuToggle from "@/components/ui/toggle/MenuToggle";
import ProjectMenu from "@/components/overview/ProjectMenu";
import Calendar from "@/components/overview/Calendar";
import ProjectOverviewList from "@/components/overview/ProjectOverviewList";
import { useOverview } from "@/store/useOverviewStore";

export default function Overview() {
    const { optionIndex } = useOverview();

    return (
        <div className="min-h-screen flex mx-24 my-16 gap-16">
            <div className="w-72 flex flex-col gap-8 items-center">
                <MenuToggle />
                {optionIndex === 0 ? <ProjectMenu /> : <Calendar />}
            </div>
            <div className="flex-1">
                {optionIndex === 0 ? <ProjectOverviewList /> : ""}
            </div>
        </div>
    );
}
