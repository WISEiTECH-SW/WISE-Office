import React, { useState, useEffect } from "react";

import {
    ProjectInfo,
    ProjectLogList,
    ProjectLogWriteButton,
    ProjectLog,
    ProjectAttendantList,
    ProjectData,
    Log,
} from "@/components/project";

import { createLog, deleteLog } from "@/lib/project/log";
import { editProjectInfo, deleteProject } from "@/lib/project/info";
import {
    createCommentToLog,
    deleteCommentFromLog,
} from "@/lib/project/comment";
import { getAttendantCount } from "@/lib/common/util";

const WiseTechProject = () => {
    // 예시 데이터 -> 백에서 받는 데이터로 변경 예정
    //참여자 예시 데이터
    const data_attendant = [
        "USER_01",
        "USER_02",
        "USER_03",
        "USER_04",
        "USER_05",
        "USER_06",
    ];

    // 프로젝트 정보 예시 데이터
    const data_projectInfo: ProjectData = {
        title: "Project 1",
        manager: "User_01",
        participantsCount: getAttendantCount(data_attendant),
        start: new Date("2022-01-01"),
        end: new Date("2026-12-31"),
    };

    // 로그 & 댓글 예시 데이터
    const [data_logComment, setLogs] = useState<Log[]>([
        {
            id: 1,
            title: "프로젝트 계획서 작성",
            user: "USER_01",
            content:
                "프로젝트 초기 계획서를 작성했습니다. 주요 목표와 일정을 포함하여 상세히 기술했습니다.",
            date: "2025-08-08 16:04",
            comments: [
                {
                    id: 1,
                    user: "USER_02",
                    content: "계획서 검토 완료했습니다.",
                    date: "2025-08-08 16:30",
                },
                {
                    id: 2,
                    user: "USER_03",
                    content: "일정 조정이 필요할 것 같습니다.",
                    date: "2025-08-08 17:00",
                },
                {
                    id: 5,
                    user: "USER_04",
                    content: "확인했습니다.",
                    date: "2025-08-08 17:30",
                },
            ],
        },
        {
            id: 2,
            title: "요구사항 분석",
            user: "USER_02",
            content:
                "클라이언트와의 미팅을 통해 상세한 요구사항을 분석했습니다.",
            date: "2025-08-08 14:20",
            comments: [
                {
                    id: 3,
                    user: "USER_01",
                    content: "분석 내용이 상세하네요. 좋습니다.",
                    date: "2025-08-08 15:00",
                },
            ],
        },
        {
            id: 3,
            title: "시스템 설계",
            user: "USER_03",
            content:
                "전체적인 시스템 아키텍처를 설계했습니다. 확장성을 고려한 설계입니다.",
            date: "2025-08-08 11:15",
            comments: [],
        },
        {
            id: 4,
            title: "데이터베이스 스키마",
            user: "USER_01",
            content:
                "데이터베이스 스키마 초안을 작성했습니다. 정규화를 적용했습니다.",
            date: "2025-08-08 09:30",
            comments: [
                {
                    id: 4,
                    user: "USER_02",
                    content: "스키마 구조가 깔끔하네요.",
                    date: "2025-08-08 10:00",
                },
            ],
        },
    ]);

    // UI 초기 값 설정
    const [selectedLog, setSelectedLog] = useState<Log | null>(
        data_logComment[0]
    );
    const [newComment, setNewComment] = useState("");
    useEffect(() => {
        setNewComment("");
    }, [selectedLog]);

    // 이벤트 핸들러 (백단 연결, 인가 기능 필요)
    // 로그 생성 핸들러
    const handleAddLog = () => {
        //모달에서 받아야함
        const newLog = createLog(
            "Test Create Log",
            "Test Create Log",
            "Tester"
        );
        setLogs((prevLogs) => [newLog, ...prevLogs]);
        setSelectedLog(newLog);
    };

    // 로그 삭제 핸들러
    const handleDeleteLog = (logId: number) => {
        if (window.confirm("정말 이 로그를 삭제하시겠습니까?")) {
            const updatedLogs = deleteLog(data_logComment, logId);
            setLogs(updatedLogs);

            if (selectedLog?.id === logId) {
                setSelectedLog(updatedLogs.length > 0 ? updatedLogs[0] : null);
            }
        }
    };

    // 댓글 생성 핸들러
    const handleAddComment = () => {
        if (!selectedLog || newComment.trim() === "") {
            return;
        }

        // 백 연결 필요
        const updatedLogs = createCommentToLog(
            data_logComment,
            selectedLog.id,
            newComment,
            "Tester"
        );

        setLogs(updatedLogs);
        setNewComment("");

        // 선택된 로그 상태를 업데이트하여 즉시 UI에 반영
        const newlySelectedLog = updatedLogs.find(
            (log) => log.id === selectedLog.id
        );
        if (newlySelectedLog) {
            setSelectedLog(newlySelectedLog);
        }
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = (logId: number, commentId: number) => {
        // 백 연결 필요
        const updatedLogs = deleteCommentFromLog(
            data_logComment,
            logId,
            commentId
        );
        setLogs(updatedLogs);

        const newlySelectedLog = updatedLogs.find(
            (log) => log.id === selectedLog?.id
        );
        if (newlySelectedLog) {
            setSelectedLog(newlySelectedLog);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                {/* Project Information */}
                <ProjectInfo
                    project={data_projectInfo}
                    onEdit={editProjectInfo}
                    onDelete={deleteProject}
                />
                <div className="grid grid-cols-12 gap-6">
                    {/* LOG List - Left */}
                    <div className="col-span-3">
                        <ProjectLogList
                            logs={data_logComment}
                            selectedLog={selectedLog}
                            onSelectLog={setSelectedLog}
                            onDeleteLog={handleDeleteLog}
                        />
                        <div className="mt-2">
                            <ProjectLogWriteButton onClick={handleAddLog} />
                        </div>
                    </div>

                    {/* LOG & Comment - Center */}
                    <div className="col-span-6">
                        <ProjectLog
                            selectedLog={selectedLog}
                            newComment={newComment}
                            onCommentChange={(e) =>
                                setNewComment(e.target.value)
                            }
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                        />
                    </div>

                    {/* Attendant List - Right */}
                    <div className="col-span-3">
                        <ProjectAttendantList attendants={data_attendant} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WiseTechProject;
