import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DocType } from "@/types/document";

import MinuteForm from "@/components/document/MinuteForm";
import ApproveForm from "@/components/document/ApproveForm";

import ActionBar from "@/components/document/ActionBar";
import Sidebar from "@/components/document/side-bar/SideBar";

export default function DocumentPage() {
    const router = useRouter();
    const { projectId, docType, docId } = router.query;

    const [currentDoc, setCurrentDoc] = useState<DocType>("minute");
    const [lastSaved] = useState<boolean>(false);
    const [savedTime] = useState<string | null>(null);
    const [isFading] = useState<boolean>(false);

    useEffect(() => {
        if (
            docType === "minute" ||
            docType === "approve" ||
            docType === "trip"
        ) {
            setCurrentDoc(docType);
        }
    }, [docType]);

    const selectDocType = (docType: DocType) => {
        router.push(`/projects/${projectId}/documents/${docType}/${docId}`);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto flex flex-col bg-blue-50">
                {/* Header */}
                <ActionBar
                    lastSaved={lastSaved}
                    savedTime={savedTime}
                    createApprove={() =>
                        router.push(
                            `/projects/${projectId}/documents/approve/${docId}`,
                        )
                    }
                    exit={() => router.push(`/projects/${projectId}`)}
                />

                {/* Paper */}
                <div className="flex-1 p-8">
                    <div className="flex justify-center">
                        <div
                            className="bg-white w-full max-w-[720px] min-h-[1020px] p-[14mm] rounded-sm transition-opacity duration-200"
                            style={{
                                opacity: isFading ? 0 : 1,
                                boxShadow:
                                    "0 2px 8px rgba(30,64,175,0.08), 0 8px 32px rgba(30,64,175,0.10), 0 0 0 1px rgba(30,64,175,0.06)",
                            }}
                        >
                            <div className="print-area">
                                {currentDoc == "minute" && <MinuteForm />}
                                {currentDoc == "approve" && <ApproveForm />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <Sidebar currentDoc={currentDoc} selectDoc={selectDocType} />
        </div>
    );
}
