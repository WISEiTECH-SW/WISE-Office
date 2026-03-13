import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    ApproveUpdateRequest,
    DocType,
    MinutesCreateRequest,
    MinutesDetail,
} from "@/types/document";

import MinuteForm from "@/components/document/MinuteForm";
import ApproveForm from "@/components/document/ApproveForm";

import ActionBar from "@/components/document/ActionBar";
import Sidebar from "@/components/document/side-bar/SideBar";
import { useMinutesMutation } from "@/hooks/doc/useMinutesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectInfo } from "@/types/project";
import {
    useApproveDetail,
    useApproveUpdate,
} from "@/hooks/project/useDocuments";
import AttendanceModal from "@/components/modal/AttendanceModal";

export default function DocumentPage() {
    const router = useRouter();
    const { docType } = router.query;

    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    const [attendance, setAttendance] = useState<string | null>(null);
    /* ---- func ---- */
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSelectAttendees = (selectedList: string[]) => {
        const selectAttendance = selectedList.join(", ");

        setAttendance(selectAttendance);

        setForm((prev) => ({
            ...prev,
            minutesAttendants: selectAttendance,
            instAttendants: selectAttendance,
        }));

        closeModal();
    };

    const projectId = Number(
        typeof router.query.projectId === "string" ? router.query.projectId : 0,
    );

    const docId = Number(
        typeof router.query.docId === "string" ? router.query.docId : 0,
    );

    const isNew = docId === 0 ? true : false;

    /* ----- useState ----- */
    const [currentDoc, setCurrentDoc] = useState<DocType>("minute");
    const [lastSaved] = useState<boolean>(false);
    const [savedTime, setSavedTime] = useState<string | null>(null);
    const [isFading] = useState<boolean>(false);

    const [form, setForm] = useState<MinutesCreateRequest>({
        host: "",
        minutesDate: "",
        startTime: "",
        endTime: "",
        location: "",
        purpose: "",
        minutesAttendants: "",
        instAttendants: "",
        writer: "",
        content: "",
    });

    const [newApprove, setNewApprove] = useState<ApproveUpdateRequest>({
        reportNo: "",
        writer: "",
    });

    const isValid =
        docType === "minute"
            ? form.host.trim() !== "" &&
              form.minutesDate.trim() !== "" &&
              form.startTime.trim() !== "" &&
              form.endTime.trim() !== "" &&
              form.location.trim() !== "" &&
              form.purpose.trim() !== "" &&
              form.minutesAttendants.trim() !== "" &&
              form.instAttendants.trim() !== "" &&
              form.writer.trim() !== "" &&
              form.content.trim() !== ""
            : newApprove.reportNo.trim() !== "" &&
              newApprove.writer.trim() !== "";

    /* ----- query ----- */
    const queryClient = useQueryClient();
    const projectInfo = queryClient.getQueryData<ProjectInfo>([
        "project",
        projectId,
    ]);
    const minuteDetail = queryClient.getQueryData<MinutesDetail>([
        "minutes",
        projectId,
        docType === "minute" ? docId : null,
    ]);
    const { data: approveDetail } = useApproveDetail(
        router.isReady ? Number(projectId) : undefined,
        router.isReady ? Number(docId) : undefined,
    );
    /* ----- mutation ----- */
    const { createMinute } = useMinutesMutation();
    const approveUpdate = useApproveUpdate();
    /* ----- func ----- */
    const selectDocType = (docType: DocType) => {
        router.push(`/projects/${projectId}/documents/${docType}/${docId}`);
    };

    const backToProjectPage = () => router.push(`/projects/${projectId}`);

    const saveDoc = () => {
        if (!router.isReady) return;
        if (isNew) {
            createMinute(
                { projectId, newMinute: form },
                { onSuccess: () => backToProjectPage() },
            );
        } else {
            // 수정로직
            if (docType === "approve") {
                console.log(newApprove);
                approveUpdate.mutate({
                    projectId,
                    approveId: Number(docId),
                    request: newApprove,
                });
            }
        }
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

    useEffect(() => {
        if (minuteDetail) {
            const {
                host,
                minutesDate,
                startTime,
                endTime,
                location,
                purpose,
                minutesAttendants,
                instAttendants,
                writer,
                meetingContent,
            } = minuteDetail;

            setForm({
                host,
                minutesDate,
                startTime,
                endTime,
                location,
                purpose,
                minutesAttendants,
                instAttendants,
                writer,
                content: meetingContent, // 필드명 불일치, 서버 dto 수정 예정
            });

            setSavedTime("MM/DD HH:MM");
        }
    }, [minuteDetail]);

    return (
        <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto flex flex-col bg-blue-50">
                {/* Header */}
                <ActionBar
                    isNew={isNew}
                    lastSaved={lastSaved}
                    savedTime={savedTime}
                    isValid={isValid}
                    saveDoc={saveDoc}
                    // 추후 수정
                    // createApprove={() =>
                    //     createApprove.mutate({
                    //         projectId: Number(projectId),
                    //         minutesId: Number(docId),
                    //     })
                    // }
                    exit={backToProjectPage}
                />

                {/* Paper */}
                <div className="flex-1 p-8 relative">
                    <div className="flex justify-center">
                        <div
                            className="bg-white w-full max-w-[720px] min-h-[1020px] px-16 py-8 rounded-sm transition-opacity duration-200"
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
                                        openAttendanceModal={openModal}
                                    />
                                )}
                                {currentDoc === "approve" && (
                                    <ApproveForm
                                        approve={approveDetail}
                                        newApprove={newApprove}
                                        setNewApprove={setNewApprove}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {docType === "minute" && isModalOpen && (
                        <div className="absolute right-10 top-10 w-[320px]">
                            <AttendanceModal
                                isOpen={isModalOpen}
                                onClose={closeModal}
                                onConfirm={handleSelectAttendees}
                                attendants={projectInfo?.proposalAttendant}
                                selectedNames={
                                    form.instAttendants
                                        ? form.instAttendants
                                              .split(", ")
                                              .map((n) => n.trim())
                                        : []
                                }
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar */}
            <Sidebar currentDoc={currentDoc} selectDoc={selectDocType} />
        </div>
    );
}
