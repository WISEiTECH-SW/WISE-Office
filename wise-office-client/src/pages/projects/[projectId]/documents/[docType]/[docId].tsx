import {
    ApproveUpdateRequest,
    DocType,
    MinutesCreateRequest,
    MinutesDetail,
} from "@/types/document";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ApproveForm from "@/components/document/ApproveForm";
import MinuteForm from "@/components/document/MinuteForm";

import ActionBar from "@/components/document/ActionBar";
import Sidebar from "@/components/document/side-bar/SideBar";
import AttendanceModal from "@/components/modal/AttendanceModal";
import { useMinutesMutation } from "@/hooks/doc/useMinutesMutation";
import {
    useApproveDetail,
    useApproveUpdate,
    usePossibleAttendantsList,
} from "@/hooks/project/useDocuments";
import { ProjectInfo } from "@/types/project";
import { useQueryClient } from "@tanstack/react-query";

export default function DocumentPage() {
    const router = useRouter();
    const { docType } = router.query;

    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    /* ---- func ---- */
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSelectAttendees = (data: {
        attendants: string[];
        writer: string;
    }) => {
        const selectAttendance = data.attendants.join(", ");

        setForm((prev) => ({
            ...prev,
            minutesAttendants: selectAttendance,
            writer: data.writer,
        }));

        closeModal();
    };

    const projectId = Number(
        typeof router.query.projectId === "string" ? router.query.projectId : 0,
    );

    const docId = Number(
        typeof router.query.docId === "string" ? router.query.docId : 0,
    );

    const isNew = docId === 0;

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
            ? (form.host ?? "").trim() !== "" &&
              (form.minutesDate ?? "").trim() !== "" &&
              (form.startTime ?? "").trim() !== "" &&
              (form.endTime ?? "").trim() !== "" &&
              (form.location ?? "").trim() !== "" &&
              (form.purpose ?? "").trim() !== "" &&
              (form.minutesAttendants ?? "").trim() !== "" &&
              (form.instAttendants ?? "").trim() !== "" &&
              (form.writer ?? "").trim() !== "" &&
              (form.content ?? "").trim() !== ""
            : (newApprove.reportNo ?? "").trim() !== "" &&
              (newApprove.writer ?? "").trim() !== "";

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
    const { data: possibleAttendants } = usePossibleAttendantsList(
        projectId,
        form.minutesDate,
    );

    /* ----- mutation ----- */
    const { createMinute, updateMinute } = useMinutesMutation();
    const approveUpdate = useApproveUpdate();

    /* ----- func ----- */
    const selectDocType = (nextDocType: DocType) => {
        router.push(`/projects/${projectId}/documents/${nextDocType}/${docId}`);
    };

    const backToProjectPage = (selectedDoc?: {
        type: "minute" | "approve" | "log";
        id: number;
    }) => {
        if (!selectedDoc) {
            router.push(`/projects/${projectId}`);
            return;
        }

        router.push(
            `/projects/${projectId}?selectedType=${selectedDoc.type}&selectedId=${selectedDoc.id}`,
        );
    };

    const saveDoc = () => {
        if (!router.isReady) return;
        if (isNew) {
            createMinute(
                { projectId, newMinute: form },
                { onSuccess: () => backToProjectPage() },
            );
            return;
        }

        if (currentDoc === "minute") {
            updateMinute(
                {
                    projectId,
                    minutesId: Number(docId),
                    request: form,
                },
                {
                    onSuccess: () =>
                        backToProjectPage({
                            type: "minute",
                            id: Number(docId),
                        }),
                },
            );
            return;
        }

        if (currentDoc === "approve") {
            approveUpdate.mutate({
                projectId,
                approveId: Number(docId),
                request: newApprove,
            });
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
                content,
            } = minuteDetail;

            setForm({
                host: host ?? "",
                minutesDate: minutesDate ?? "",
                startTime: startTime ?? "",
                endTime: endTime ?? "",
                location: location ?? "",
                purpose: purpose ?? "",
                minutesAttendants: minutesAttendants ?? "",
                instAttendants: instAttendants ?? "",
                writer: writer ?? "",
                content: content ?? "",
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
                    exit={backToProjectPage}
                />

                <div className="flex-1 p-8">
                    <div className="flex justify-center gap-10">
                        {/* Paper */}
                        <div
                            className="bg-white w-full max-w-[720px] min-h-[1020px] rounded-sm transition-opacity duration-200"
                            style={{
                                opacity: isFading ? 0 : 1,
                                boxShadow:
                                    "0 2px 8px rgba(30,64,175,0.08), 0 8px 32px rgba(30,64,175,0.10), 0 0 0 1px rgba(30,64,175,0.06)",
                            }}
                        >
                            <div className="print-area">
                                {currentDoc === "minute" && (
                                    <MinuteForm
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

                        {/* Attendance Modal */}
                        {currentDoc === "minute" && isModalOpen && (
                            <div className="w-[320px] shrink-0">
                                <AttendanceModal
                                    isOpen={isModalOpen}
                                    onClose={closeModal}
                                    onConfirm={handleSelectAttendees}
                                    attendants={projectInfo?.proposalAttendant}
                                    possibleAttendants={possibleAttendants}
                                    selectedNames={
                                        form.minutesAttendants
                                            ? form.minutesAttendants
                                                  .split(", ")
                                                  .map((n) => n.trim())
                                            : []
                                    }
                                    selectedWriter={form.writer}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <Sidebar currentDoc={currentDoc} selectDoc={selectDocType} />
        </div>
    );
}
