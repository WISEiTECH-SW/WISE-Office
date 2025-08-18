import React, { useState } from "react";

import {
    ProjectInfo,
    ProjectLogList,
    ProjectLogWriteButton,
    ProjectLog,
    ProjectParticipants,
    ProjectData,
    Log,
} from "@/components/project";

import { addLog } from "@/lib/project/log";
import { editProjectInfo, deleteProject } from "@/lib/project/button";

const WiseTechProject = () => {
    // 프로젝트 정보 예시 데이터
    const projectData: ProjectData = {
        title: "Project 1",
        duration: "2024.01 ~ 2026.12",
        status: "3차년도",
        manager: "User_01",
        participantsCount: 6,
    };

    // 로그 & 댓글 데이터 예시
    const [logs, setLogs] = useState<Log[]>([
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

    // 로그, 댓글 혼합 type 설정
    const [selectedLog, setSelectedLog] = useState<Log | null>(logs[0]);
    const [newComment, setNewComment] = useState("");

    //우측 사이드바 예시 데이터
    const participants = [
        "USER_01",
        "USER_02",
        "USER_03",
        "USER_04",
        "USER_05",
    ];

    //댓글 작성 메소드
    const addComment = () => {
        if (newComment.trim() && selectedLog) {
            const comment: Comment = {
                id: Date.now(),
                user: "USER_01",
                content: newComment,
                date: new Date()
                    .toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    .replace(/\. /g, "-")
                    .replace(".", "")
                    .replace(", ", " "),
            };

            const updatedLogs = logs.map((log) =>
                log.id === selectedLog.id
                    ? { ...log, comments: [...log.comments, comment] }
                    : log
            );

            setLogs(updatedLogs);
            setSelectedLog({
                ...selectedLog,
                comments: [...selectedLog.comments, comment],
            });
            setNewComment("");
        }
    };

    //로그 삭제 메소드
    const deleteLog = (id: number) => {
        setLogs(logs.filter((log) => log.id !== id));
        if (selectedLog?.id === id) {
            setSelectedLog(logs.find((log) => log.id !== id) || null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                {/* Project Header */}
                <ProjectInfo
                    project={projectData}
                    onEdit={editProjectInfo}
                    onDelete={deleteProject}
                />
                <div className="grid grid-cols-12 gap-6">
                    {/* LOG List Sidebar - Left */}
                    <div className="col-span-3">
                        <ProjectLogList
                            logs={logs}
                            selectedLog={selectedLog}
                            onSelectLog={setSelectedLog}
                            onDeleteLog={deleteLog}
                        />
                        <div className="mt-2">
                            <ProjectLogWriteButton onClick={addLog} />
                        </div>
                    </div>

                    {/* LOG Detail - Center */}
                    <div className="col-span-6">
                        <ProjectLog
                            selectedLog={selectedLog}
                            newComment={newComment}
                            // onCommentChange={(e) =>
                            //     setNewComment(e.target.value)
                            // }
                            onAddComment={addComment}
                        />
                    </div>

                    {/* 참여자 Section - Right */}
                    <div className="col-span-3">
                        <ProjectParticipants participants={participants} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WiseTechProject;
