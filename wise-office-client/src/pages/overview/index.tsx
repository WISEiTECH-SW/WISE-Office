import MenuToggle from "@/components/ui/toggle/MenuToggle";
import ProjectMenu from "@/components/overview/ProjectMenu";
import Calendar from "@/components/overview/Calendar";
import ProjectOverviewList from "@/components/overview/ProjectOverviewList";
import MonthOverviewList from "@/components/overview/MonthOverviewList";
import PreviewModal from "@/components/modal/PreviewModal";
import { useOverviewStore, usePreviewStore } from "@/store/useOverviewStore";

export default function Overview() {
    const { optionIndex, projectInfo } = useOverviewStore();
    const { isOpen, onClose } = usePreviewStore();

    return (
        <div className="min-h-screen flex mx-24 my-16 gap-16">
            <div className="w-72 flex flex-col gap-8 items-center">
                <MenuToggle />
                {optionIndex === 0 ? <ProjectMenu /> : <Calendar />}
            </div>
            <div className="flex-1">
                {optionIndex === 0 ? (
                    <ProjectOverviewList key={projectInfo.projectId} />
                ) : (
                    <MonthOverviewList />
                )}
            </div>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-1000 overflow-y-auto"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute translate-y-1/3 pb-24"
                    >
                        <PreviewModal />
                    </div>
                </div>
            )}
        </div>
    );
}
