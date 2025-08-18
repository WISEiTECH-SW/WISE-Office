import React, { useState } from "react";
import {
    Calendar,
    TrendingUp,
    User,
    Users,
    Trash2,
    Plus,
    Send,
    MessageCircle,
    Pen,
} from "lucide-react";

import { LogEntry } from "@/components/project";
import { addLog } from "@/components/project";
import { ProjectParticipants } from "@/components/project";

// interface LogEntry {
//     id: number;
//     title: string;
//     user: string;
//     content: string;
//     date: string;
//     comments: Comment[];
// }

// interface Comment {
//     id: number;
//     user: string;
//     content: string;
//     date: string;
// }

const WiseTechProject = () => {
    const [logs, setLogs] = useState<LogEntry[]>([
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

    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(logs[0]);
    const [newComment, setNewComment] = useState("");

    const participants = [
        "USER_01",
        "USER_02",
        "USER_03",
        "USER_04",
        "USER_05",
    ];

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
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Project 1
                        </h1>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                                수정
                            </button>
                            <button className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
                                삭제
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-600">
                                    프로젝트 기간
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    2024.01 ~ 2026.12
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-600">
                                    진행 상태
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    2차년도
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-600">
                                    책임자
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    User_01
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-600">
                                    참여인원
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    6명
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* LOG List Sidebar - Left */}
                    <div className="col-span-3">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="bg-gray-100 px-4 py-3 rounded-t-lg flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    LOG
                                </h2>
                                <button className="text-blue-600 hover:text-blue-800">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {logs.map((log) => (
                                    <div
                                        key={log.id}
                                        onClick={() => setSelectedLog(log)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedLog?.id === log.id
                                                ? "bg-blue-50 border-l-4 border-l-blue-500"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
                                                {log.title}
                                            </h3>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteLog(log.id);
                                                }}
                                                className="text-gray-400 hover:text-red-500 ml-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">
                                            {log.user}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {log.date}
                                        </div>
                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                            <MessageCircle className="w-3 h-3 mr-1" />
                                            {log.comments.length}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-2">
                            <button
                                onClick={addLog}
                                className="w-full py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center justify-center gap-1"
                            >
                                <Pen className="w-4 h-4" />
                                로그 작성
                            </button>
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
