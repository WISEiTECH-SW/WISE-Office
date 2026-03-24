import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { DocumentType } from "@/types/project";
import { ApproveUpdateRequest, MinutesCreateRequest } from "@/types/document";

import ApproveForm from "@/components/document/ApproveForm";
import MinuteForm from "@/components/document/MinuteForm";
import ActionBar from "@/components/document/ActionBar";
import Sidebar from "@/components/document/side-bar/SideBar";
import AttendanceModal from "@/components/modal/AttendanceModal";
import ErrorIndicator from "@/components/ui/ErrorIndicator";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

import { isFormComplete } from "@/utils/formValidation";

import {
    useProjectDetail,
    useMinuteDetail,
    useMinuteMutation,
    useApproveDetail,
    useApproveMutation,
    usePossibleAttendants,
} from "@/hooks/queries";

export default function DocumentPage() {
    const router = useRouter();
    const { docType } = router.query;

    const projectId = Number(
        typeof router.query.projectId === "string" ? router.query.projectId : 0,
    );
    const docId = Number(
        typeof router.query.docId === "string" ? router.query.docId : 0,
    );
    const isNew = docId === 0;

    const { createMinute, updateMinute } = useMinuteMutation();
    const { updateApprove } = useApproveMutation();

    /* ----- useState ----- */
    const [currentDoc, setCurrentDoc] = useState<DocumentType>("minute");
    const [approveId, setApproveId] = useState<number | null>(null);
    const [savedTime, setSavedTime] = useState<string | null>(null);
    const [isAutoSaved] = useState<boolean>(false);
    const [isFading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

    const [minuteForm, setminuteForm] = useState<MinutesCreateRequest>({
        host: "",
        minutesDate: "",
        startTime: "",
        endTime: "",
        location: "",
        purpose: "",
        minutesAttendants: [], // memberId 리스트
        instAttendants: "",
        writer: 0,
        content: "",
    });

    // 회의록 기입용 사내 참석자 이름 + 직급
    const [attendantsNameAndRank, setAttendantsNameAndRank] =
        useState<string>("");

    const [approveForm, setApproveForm] = useState<ApproveUpdateRequest>({
        reportNo: "",
        writer: "",
    });

    /* ----- query ----- */
    const projectDetail = useProjectDetail(projectId);
    const minuteDetail = useMinuteDetail(
        projectId,
        docType === "minute" && !isNew ? docId : undefined,
    );

    const possibleAttendants = usePossibleAttendants(
        projectId,
        docType === "minute" ? minuteDetail.data?.minutesDate : undefined,
    );

    const approveDetail = useApproveDetail(
        projectId,
        docType === "approve" && !isNew ? docId : undefined,
    );

    /* ----- hook ----- */
    useEffect(() => {
        if (
            docType === "minute" ||
            docType === "approve" ||
            docType === "trip"
        ) {
            setCurrentDoc(docType);
        }

        switch (docType) {
            case "minute":
                if (minuteDetail.data) {
                    setApproveId(minuteDetail.data.approveId);
                    setSavedTime(minuteDetail.data.writtenAt);
                }
                break;
            case "approve":
                if (approveDetail.data) {
                    setSavedTime(approveDetail.data.writtenAt);
                }
                break;
            default:
                break;
        }
    }, [docType, minuteDetail.data, approveDetail.data]);

    useEffect(() => {
        if (isNew) return;

        if (currentDoc === "minute" && minuteDetail.data) {
            setminuteForm({
                host: minuteDetail.data.host,
                location: minuteDetail.data.location,
                purpose: minuteDetail.data.purpose,
                minutesDate: minuteDetail.data.minutesDate,
                startTime: minuteDetail.data.startTime,
                endTime: minuteDetail.data.endTime,
                minutesAttendants: minuteDetail.data.minutesAttendants,
                instAttendants: minuteDetail.data.instAttendants,
                writer: minuteDetail.data.writer,
                content: minuteDetail.data.content,
            });
        }

        if (currentDoc === "approve" && approveDetail.data) {
            setApproveForm({
                reportNo: approveDetail.data.approveNo,
                writer: approveDetail.data.writer,
            });
        }
    }, [isNew, currentDoc, minuteDetail.data, approveDetail.data]);

    /* ----- router ----- */
    const selectDocType = (nextDocType: DocumentType) => {
        if (nextDocType === "minute" && approveDetail.data) {
            router.push(
                `/projects/${projectId}/documents/minute/${approveDetail.data.minutesId}`,
            );
        }
        if (nextDocType === "approve" && minuteDetail.data) {
            router.push(
                `/projects/${projectId}/documents/approve/${minuteDetail.data.approveId}`,
            );
        }
    };

    const backToProject = () => router.push(`/projects/${projectId}`);

    /* ----- func ----- */
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSelectAttendees = (data: {
        attendants: number[];
        writer: number;
    }) => {
        const selectAttendance = data.attendants.join(", ");

        setminuteForm((prev) => ({
            ...prev,
            minutesAttendants: data.attendants,
            writer: data.writer,
        }));

        closeModal();
    };

    const handleSubmit = () => {
        if (docType === "minute") {
            if (isNew) {
                createMinute(
                    { projectId, newMinute: minuteForm },
                    { onSuccess: () => backToProject() },
                );
            } else {
                updateMinute(
                    { projectId, minutesId: docId, request: minuteForm },
                    { onSuccess: () => backToProject() },
                );
            }
        }
        if (docType === "approve") {
            updateApprove(
                { projectId, approveId: docId, request: approveForm },
                { onSuccess: () => backToProject() },
            );
        }
    };

    /* ----- validation ----- */
    const isMinuteFormValid = isFormComplete(minuteForm);
    const isApproveFormValid = isFormComplete(approveForm);

    const isLoading =
        (docType === "minute" && minuteDetail.isLoading) ||
        (docType === "approve" && approveDetail.isLoading);

    /* ----- page ----- */
    if (isLoading)
        return (
            <LoadingIndicator
                type={docType === "minute" ? "minute" : "approve"}
            />
        );
    if (!projectDetail.data) return <ErrorIndicator />;

    return (
        <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto flex flex-col bg-blue-50">
                {/* Header */}
                <ActionBar
                    isNew={isNew}
                    isAutoSaved={isAutoSaved}
                    savedTime={savedTime}
                    isValid={
                        docType === "minute"
                            ? isMinuteFormValid
                            : isApproveFormValid
                    }
                    saveDoc={handleSubmit}
                    exit={backToProject}
                />

                <div className="flex-1 p-8">
                    <div className="flex justify-center gap-10">
                        {/* Paper */}
                        <div
                            className={`bg-white w-full max-w-[720px] min-h-[1020px] rounded-sm transition-opacity duration-200 shadow-xl
                                ${isFading ? "opacity-0" : "opacity-100"} `}
                        >
                            <div className="print-area">
                                {currentDoc === "minute" && (
                                    <MinuteForm
                                        projectName={
                                            projectDetail.data
                                                ? projectDetail.data
                                                      .projectTitle
                                                : ""
                                        }
                                        form={minuteForm}
                                        setForm={setminuteForm}
                                        openAttendanceModal={openModal}
                                        attendantsNameAndRank={
                                            attendantsNameAndRank
                                        }
                                        possibleAttendants={possibleAttendants}
                                    />
                                )}
                                {currentDoc === "approve" &&
                                    approveDetail.data && (
                                        <ApproveForm
                                            approveDetail={approveDetail.data}
                                            form={approveForm}
                                            setForm={setApproveForm}
                                        />
                                    )}
                            </div>
                        </div>

                        {/* Attendance Modal */}
                        {currentDoc === "minute" && isModalOpen && (
                            <div className="w-[320px] shrink-0">
                                <AttendanceModal
                                    onClose={closeModal}
                                    onConfirm={handleSelectAttendees}
                                    selectedIds={minuteForm.minutesAttendants}
                                    selectedWriterId={minuteForm.writer}
                                    setAttendantsNameAndRank={
                                        setAttendantsNameAndRank
                                    }
                                    attendants={
                                        projectDetail.data.proposalAttendant
                                    }
                                    possibleAttendants={
                                        possibleAttendants.data ?? []
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <Sidebar
                currentDoc={currentDoc}
                isNew={isNew}
                isApproveExist={approveId !== null}
                selectDoc={selectDocType}
            />
        </div>
    );
}
