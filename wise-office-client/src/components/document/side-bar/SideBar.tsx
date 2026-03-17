import { DocType } from "@/types/document";
import SidebarItem from "./SideBarItem";

import { NotepadText, ClipboardCheck, BriefcaseBusiness } from "lucide-react";

interface SideBarProps {
    currentDoc: DocType;
    isNew: boolean;
    selectDoc: (docType: DocType) => void;
}

export default function Sidebar({
    currentDoc,
    isNew,
    selectDoc,
}: SideBarProps) {
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
                isDisabled={false}
                onClick={() => selectDoc("minute")}
            />

            <SidebarItem
                label="품의서"
                icon={<ClipboardCheck />}
                isActive={isActive("approve")}
                isDisabled={isNew}
                onClick={() => selectDoc("approve")}
            />

            <SidebarItem
                label="출장복명서"
                icon={<BriefcaseBusiness />}
                isActive={isActive("trip")}
                isDisabled={true}
                onClick={() => selectDoc("trip")}
            />

            <div className="border-t border-blue-100 my-3 mx-2" />

            <div className="px-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-blue-700">
                    사용 안내
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    셀을 클릭해 셀 안에 내용을 직접 입력하세요.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    좌측의{" "}
                    <span className="text-blue-500 font-medium">
                        편성 인원 검색
                    </span>{" "}
                    을 사용해서 참석자와 작성자를 선택하세요.
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
