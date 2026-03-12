import { DocType } from "@/types/document";
import SidebarItem from "./SideBarItem";

import { NotepadText, ClipboardCheck, BriefcaseBusiness } from "lucide-react";

interface SideBarProps {
    currentDoc: DocType;
    selectDoc: (docType: DocType) => void;
}

export default function Sidebar({ currentDoc, selectDoc }: SideBarProps) {
    const isActive = (type: DocType): boolean => {
        return type === currentDoc;
    };

    return (
        <aside className="print:hidden w-52 shrink-0 bg-white border-l border-blue-100 flex flex-col py-6 px-3 gap-0.5 overflow-y-auto">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-3 mb-3">
                문서 종류
            </p>

            <SidebarItem
                label="회의록"
                icon={<NotepadText />}
                isActive={isActive("minute")}
                onClick={() => selectDoc("minute")}
            />

            <SidebarItem
                label="품의서"
                icon={<ClipboardCheck />}
                isActive={isActive("approve")}
                onClick={() => selectDoc("approve")}
            />

            <SidebarItem
                label="출장복명서"
                icon={<BriefcaseBusiness />}
                isActive={isActive("trip")}
                onClick={() => selectDoc("trip")}
            />

            <div className="border-t border-blue-100 my-3 mx-2" />

            <div className="px-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-blue-700">
                    사용 안내
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    셀을 클릭해 내용을 직접 입력하세요.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    <span className="text-blue-500 font-medium">
                        품의서 생성
                    </span>{" "}
                    버튼으로 현재 문서 기반의 품의서를 빠르게 만들 수 있습니다.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    <span className="text-blue-500 font-medium">출력</span> 시
                    사이드바 및 버튼은 자동으로 제외됩니다.
                </p>
            </div>

            <div className="mt-auto px-3 pt-4 border-t border-blue-50">
                <p className="text-[10px] text-blue-200 text-center">
                    문서 작성기 v1.0
                </p>
            </div>
        </aside>
    );
}
