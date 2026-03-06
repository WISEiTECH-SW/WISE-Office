import ProjectMenu from "@/components/overview/ProjectMenu";
import OverviewList from "@/components/overview/OverviewList";
import { useApproval } from "@/store/useApprovalStore";
import MenuToggle from "@/components/ui/toggle/MenuToggle";

export default function Overview() {
    const { optionIndex } = useApproval();

    return (
        <div className="min-h-screen flex mx-24 my-16 gap-16">
            <div className="w-72 flex flex-col gap-8 items-center">
                <MenuToggle />
                {optionIndex === 0 ? <ProjectMenu /> : ""}
            </div>
            <div className="flex-1">
                <OverviewList />
            </div>
        </div>
    );
}
