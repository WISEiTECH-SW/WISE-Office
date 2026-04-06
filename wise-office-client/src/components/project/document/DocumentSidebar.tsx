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
    documentPageInfo?: {
        logsPage: { totalPages: number; currentPage: number };
        minutesPage: { totalPages: number; currentPage: number };
        approvalsPage: { totalPages: number; currentPage: number };
    };
    setDocumentPage?: {
        logsPage: (page: number) => void;
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
    documentPageInfo,
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

    const pageInfo =
        selectedDoc.type === "minute"
            ? documentPageInfo?.minutesPage
            : selectedDoc.type === "log"
              ? documentPageInfo?.logsPage
              : documentPageInfo?.approvalsPage;

    const totalPages = pageInfo?.totalPages ?? 0;
    const currentPage = pageInfo?.currentPage ?? 0;

    const handleWrite = () => {
        if (selectedDoc.type === "minute") {
            onWrite("minute");
        } else {
            onWrite("log");
        }
    };
    const PAGE_SIZE = 5;

    const currentGroup = Math.floor(currentPage / PAGE_SIZE);
    const startPage = currentGroup * PAGE_SIZE;
    const endPage = Math.min(startPage + PAGE_SIZE, totalPages);

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
                <div className=" flex justify-center items-center gap-2 m-2 pb-2">
                    {/* 이전 그룹 */}
                    {startPage > 0 && (
                        <button
                            onClick={() => {
                                const prevPage = startPage - 1;

                                if (selectedDoc.type === "minute") {
                                    setDocumentPage?.minutesPage(prevPage);
                                } else if (selectedDoc.type === "log") {
                                    setDocumentPage?.logsPage(prevPage);
                                } else {
                                    setDocumentPage?.approvalsPage(prevPage);
                                }
                            }}
                            className="px-2 py-1 rounded cursor-pointer"
                        >
                            {"<<"}
                        </button>
                    )}
                    {Array.from({ length: endPage - startPage }, (_, i) => {
                        const page = startPage + i;

                        return (
                            <button
                                key={page}
                                onClick={() => {
                                    if (selectedDoc.type === "minute") {
                                        setDocumentPage?.minutesPage(page);
                                    } else if (selectedDoc.type === "log") {
                                        setDocumentPage?.logsPage(page);
                                    } else {
                                        setDocumentPage?.approvalsPage(page);
                                    }
                                }}
                                className={`min-w-[28px] h-7 flex items-center justify-center cursor-pointer rounded text-sm ${
                                    currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                {page + 1}
                            </button>
                        );
                    })}

                    {/* 다음 그룹 */}
                    {endPage < totalPages && (
                        <button
                            onClick={() => {
                                const nextPage = endPage;

                                if (selectedDoc.type === "minute") {
                                    setDocumentPage?.minutesPage(nextPage);
                                } else if (selectedDoc.type === "log") {
                                    setDocumentPage?.logsPage(nextPage);
                                } else {
                                    setDocumentPage?.approvalsPage(nextPage);
                                }
                            }}
                            className="px-2 py-1 rounded cursor-pointer"
                        >
                            {">>"}
                        </button>
                    )}
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
