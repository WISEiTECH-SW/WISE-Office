import LeftMenu from "@/components/overview/LeftMenu";
import OverviewList from "@/components/overview/OverviewList";
import { useApproval } from "@/store/useApprovalStore";

export default function Overview() {
    const { year, projectId } = useApproval();

    return (
        <div className="min-h-screen flex my-24 mx-24 gap-16">
            <LeftMenu />
            <div className="flex-1">
                <OverviewList />
            </div>
        </div>
    );
}
