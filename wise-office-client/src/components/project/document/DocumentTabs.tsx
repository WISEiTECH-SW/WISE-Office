import { DocumentType } from "@/types/project";

interface DocumentTabsProps {
    activeDocType: DocumentType;
    onChangeTab: (tab: DocumentType) => void;
}

export default function DocumentTabs({
    activeDocType,
    onChangeTab,
}: DocumentTabsProps) {
    const tabs: { key: DocumentType; label: string }[] = [
        { key: "log", label: "로그" },
        { key: "minute", label: "회의" },
        { key: "approve", label: "품의" },
    ];
    return (
        <div className="bg-gray-100 pt-2 px-2 flex border-b border-gray-300">
            <div className="grid grid-cols-3 gap-2 items-end">
                {tabs.map((tab) => {
                    const isActive = activeDocType === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onChangeTab(tab.key)}
                            className={`
                            col-span-1 px-6 py-2 text-sm md:text-base transition-all cursor-pointer rounded-t-lg relative -mb-[1px]
                            ${
                                isActive
                                    ? "bg-white text-blue-600 font-bold border-t border-l border-r border-gray-300 z-10"
                                    : "bg-transparent text-gray-500 hover:bg-gray-200 border-transparent"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
