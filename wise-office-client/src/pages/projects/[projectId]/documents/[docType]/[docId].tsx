import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DocType, MinutesCreateRequest } from "@/types/document";

import MinuteForm from "@/components/document/MinuteForm";
import ApproveForm from "@/components/document/ApproveForm";

import ActionBar from "@/components/document/ActionBar";
import Sidebar from "@/components/document/side-bar/SideBar";
import { useMinutesMutation } from "@/hooks/doc/useMinutesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectInfo } from "@/types/project";

export default function DocumentPage() {
    const router = useRouter();
    const { docType, docId } = router.query;

    const projectId = Number(
        typeof router.query.projectId === "string" ? router.query.projectId : 0,
    );

    /* ----- useState ----- */
    const [currentDoc, setCurrentDoc] = useState<DocType>("minute");
    const [lastSaved] = useState<boolean>(false);
    const [savedTime] = useState<string | null>(null);
    const [isFading] = useState<boolean>(false);

    /* ----- query ----- */
    const queryClient = useQueryClient();
    const projectInfo = queryClient.getQueryData<ProjectInfo>([
        "project",
        projectId,
    ]);

    const [form, setForm] = useState<MinutesCreateRequest>({
        host: "",
        minutesDate: "",
        startTime: "",
        endTime: "",
        location: "",
        purpose: "",
        minutesAttendants: "",
        instAttendants: "",
        writer: "작성자 이름", // 사용자 이름 가져오는 로직 필요
        content: "",
    });

    /* ----- mutation ----- */
    const { createMinute } = useMinutesMutation();

    /* ----- func ----- */
    const selectDocType = (docType: DocType) => {
        router.push(`/projects/${projectId}/documents/${docType}/${docId}`);
    };

    const backToProjectPage = () => router.push(`/projects/${projectId}`);

    const saveDoc = () => {
        createMinute({ projectId, newMinute: form });
        backToProjectPage();
    };

    /* ----- hook ----- */
    useEffect(() => {
        if (
            docType === "minute" ||
            docType === "approve" ||
            docType === "trip"
        ) {
            setCurrentDoc(docType);
        }
    }, [docType]);

    return (
        <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto flex flex-col bg-blue-50">
                {/* Header */}
                <ActionBar
                    lastSaved={lastSaved}
                    savedTime={savedTime}
                    saveDoc={saveDoc}
                    createApprove={() =>
                        router.push(
                            `/projects/${projectId}/documents/approve/${docId}`,
                        )
                    }
                    exit={backToProjectPage}
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
                                {currentDoc == "minute" && (
                                    <MinuteForm
                                        projectInfo={projectInfo}
                                        projectName={
                                            projectInfo
                                                ? projectInfo.projectTitle
                                                : ""
                                        }
                                        form={form}
                                        setForm={setForm}
                                    />
                                )}
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
