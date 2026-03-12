import { DocumentType, SelectedDocument } from "@/types/project";
import { Log } from "@/types/log";

import DocumentTabs from "./DocumentTabs";
import DocumentList from "./DocumentList";
import DocumentWriteButton from "./DocumentWriteButton";
import { ApproveListResponse, MinutesListResponse } from "@/types/document";

interface DocumentSidebarProps {
    docData: {
        logList: Log[];
        minuteList: MinutesListResponse[];
        approveList: ApproveListResponse[];
    };
    selectedDoc: SelectedDocument | null;
    attending: boolean;
    setSelectedDoc: (document: SelectedDocument) => void;
    onWrite: (type: DocumentType) => void;
}

export default function DocumentSidebar({
    docData,
    selectedDoc,
    attending,
    setSelectedDoc,
    onWrite,
}: DocumentSidebarProps) {
    const selectTab = (tab: DocumentType) => {
        setSelectedDoc({ type: tab, id: 0 });
    };

    const selectDoc = (type: DocumentType, id: number) => {
        setSelectedDoc({ type: type, id: id });
    };

    const handleWrite = () => {
        if (selectedDoc?.type === "minute") {
            onWrite("minute");
        } else {
            onWrite("log");
        }
    };

    return (
        <div className="order-2 md:order-1 md:col-span-3 mb-6">
            <div className="md:min-h-52 bg-white rounded-lg shadow-sm">
                <DocumentTabs
                    activeDocType={selectedDoc ? selectedDoc.type : "log"}
                    onChangeTab={selectTab}
                />

                <DocumentList
                    selectedDoc={selectedDoc}
                    docData={docData}
                    onSelectDoc={selectDoc}
                />
            </div>

            {attending && selectedDoc?.type != "approve" && (
                <DocumentWriteButton label={"작성하기"} onClick={handleWrite} />
            )}
        </div>
    );
}
