import React, { useState } from "react";
import { User, Trash2, Plus, Send, MessageCircle, Pen } from "lucide-react";

import { ProjectInfo, ProjectData } from "@/components/project";
import {
    ProjectLogList,
    ProjectLogWriteButton,
    Log,
} from "@/components/project";
import { addLog } from "@/components/project";
import { ProjectParticipants } from "@/components/project";

const WiseTechProject = () => {
    // 프로젝트 정보 예시 데이터
    const projectData: ProjectData = {
        title: "Project 1",
        duration: "2024.01 ~ 2026.12",
        status: "3차년도",
        manager: "User_01",
        participantsCount: 6,
    };

    // 버튼 메소드(임시)
    const handleEdit = () => {
        alert("수정 버튼 클릭");
    };

    const handleDelete = () => {
        alert("삭제 버튼 클릭");
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
                        {selectedLog ? (
                            <div className="bg-white rounded-lg shadow-sm">
                                {/* Log Header */}
                                <div className="border-b p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        {selectedLog.title}
                                    </h2>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium">
                                            {selectedLog.user}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>{selectedLog.date}</span>
                                    </div>
                                </div>

                                {/* Log Content */}
                                <div className="p-6 border-b">
                                    <p className="text-gray-700 leading-relaxed">
                                        {selectedLog.content}
                                    </p>
                                </div>

                                {/* Comments Section */}
                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        댓글 ({selectedLog.comments.length})
                                    </h3>

                                    {/* Comment Input */}
                                    <div className="flex gap-3 mb-6">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) =>
                                                    setNewComment(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="댓글을 입력하세요..."
                                                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm"
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    onClick={addComment}
                                                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    댓글 작성
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments List */}
                                    <div className="space-y-4">
                                        {selectedLog.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="flex gap-3"
                                            >
                                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-medium text-sm text-gray-800">
                                                                {comment.user}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {comment.date}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <div className="text-gray-400 mb-2">
                                    <MessageCircle className="w-16 h-16 mx-auto" />
                                </div>
                                <p className="text-gray-500">
                                    로그를 선택해주세요
                                </p>
                            </div>
                        )}
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
