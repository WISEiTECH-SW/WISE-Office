import { DocumentType, SelectedDocument } from "@/types/project";
import { Log } from "@/types/log";

import DocumentTabs from "./DocumentTabs";
import DocumentList from "./DocumentList";
import DocumentWriteButton from "./DocumentWriteButton";

interface DocumentSidebarProps {
    logList: Log[];
    selectedDocument: SelectedDocument;
    onSelectDocument: (document: SelectedDocument) => void;
    attending: boolean;
    onButtonClick: () => void;
}

export default function DocumentSidebar({
    logList,
    selectedDocument,
    onSelectDocument,
    attending,
    onButtonClick,
}: DocumentSidebarProps) {
    const selectTab = (tab: DocumentType) => {
        onSelectDocument({ type: tab, id: 0 });
    };

    const selectDoc = (id: number) => {
        if (selectedDocument) {
            onSelectDocument({ type: selectedDocument.type, id: id });
        }
    };

    return (
        <div>
            <div className="md:min-h-52 bg-white rounded-lg shadow-sm">
                <DocumentTabs
                    activeDocType={selectedDocument.type}
                    onChangeTab={selectTab}
                />

                <DocumentList
                    selectedDoc={selectedDocument}
                    logList={logList}
                    onSelectDoc={selectDoc}
                    // minuteList={minuteList}
                    // approveList={approveList}
                />
            </div>
            {attending && selectedDocument?.type != "approve" && (
                <DocumentWriteButton
                    label={"작성하기"}
                    onClick={onButtonClick}
                />
            )}
        </div>
    );
}
