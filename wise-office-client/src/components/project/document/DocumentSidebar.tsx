import { DocumentType, SelectedDocument } from "@/types/project";
import { Log } from "@/types/log";
import DocumentTabs from "./DocumentTabs";
import DocumentList from "./DocumentList";
import { ApproveListResponse, MinutesListResponse } from "@/types/document";
import Button from "@/components/ui/Button";
import { Pen } from "lucide-react";

interface DocumentSidebarProps {
    docData: {
        logList: Log[];
        minutesList: MinutesListResponse[];
        approvalsList: ApproveListResponse[];
    };
    documnetPageInfo?: {
        minutesPage: { totalPages: number; currentPage: number };
        approvalsPage: { totalPages: number; currentPage: number };
    };
    setDocumentPage?: {
        minutesPage: (page: number) => void;
        approvalsPage: (page: number) => void;
    };
    selectedDoc: SelectedDocument;
    attending: boolean;
    setSelectedDoc: (document: SelectedDocument) => void;
    onWrite: (type: DocumentType) => void;
}

export default function DocumentSidebar({
    docData,
    documnetPageInfo,
    setDocumentPage,
    selectedDoc,
    attending,
    setSelectedDoc,
    onWrite,
}: DocumentSidebarProps) {
    const selectTab = (tab: DocumentType) => {
        setSelectedDoc({ type: tab, id: null });
    };

    const selectDoc = (type: DocumentType, id: number) => {
        setSelectedDoc({ type: type, id: id });
    };

    const isMinute = selectedDoc.type === "minute";
    const totalPages = isMinute
        ? (documnetPageInfo?.minutesPage.totalPages ?? 0)
        : (documnetPageInfo?.approvalsPage.totalPages ?? 0);

    const currentPage = isMinute
        ? (documnetPageInfo?.minutesPage.currentPage ?? 0)
        : (documnetPageInfo?.approvalsPage.currentPage ?? 0);
    const handleWrite = () => {
        if (selectedDoc.type === "minute") {
            onWrite("minute");
        } else {
            onWrite("log");
        }
    };

    return (
        <div className="order-2 md:order-1 md:col-span-3 mb-6">
            <div className="md:min-h-52 bg-white rounded-lg shadow-sm mb-4">
                <DocumentTabs
                    activeDocType={selectedDoc.type}
                    onChangeTab={selectTab}
                />

                <DocumentList
                    selectedDoc={selectedDoc}
                    docData={docData}
                    onSelectDoc={selectDoc}
                />
                <div className="flex justify-center gap-2 m-2 pb-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() =>
                                isMinute
                                    ? setDocumentPage?.minutesPage(i)
                                    : setDocumentPage?.approvalsPage(i)
                            }
                            className={`px-3 py-1  cursor-pointer rounded ${
                                currentPage === i
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {attending && selectedDoc?.type != "approve" && (
                <Button
                    label="작성하기"
                    onClick={handleWrite}
                    variant="primary"
                    icon={<Pen className="w-4 h-4" />}
                    isFull={true}
                />
            )}
        </div>
    );
}
