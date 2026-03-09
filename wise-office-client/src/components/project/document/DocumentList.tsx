import { SelectedDocument } from "@/types/project";
import { Log } from "@/types/log";
import LogItem from "./log/LogItem";

interface DocumentListProps {
    selectedDoc: SelectedDocument | null;
    logList: Log[];
    //minuteList: Minute[]
    //approveList: Approve[]
    onSelectDoc: (id: number) => void;
}

export default function DocumentList({
    selectedDoc,
    logList,
    //minuteList,
    //approveList,
    onSelectDoc,
}: DocumentListProps) {
    const renderEmpty = (text: string) => (
        <div className="flex flex-1 items-center justify-center py-4 md:py-10">
            <p className="text-gray-400 text-sm md:text-base font-medium">
                {text}
            </p>
        </div>
    );

    return (
        <div className="md:max-h-85 flex flex-nowrap pb-1 overflow-x-auto md:flex-col scrollbar-auto-hide">
            {(selectedDoc?.type === "log" || !selectedDoc) &&
                (logList.length === 0
                    ? renderEmpty("작성된 로그가 없습니다.")
                    : logList.map((log) => (
                          <LogItem
                              key={log.logId}
                              log={log}
                              isSelected={
                                  selectedDoc
                                      ? selectedDoc.id === log.logId
                                      : false
                              }
                              onSelect={onSelectDoc}
                          />
                      )))}

            {/* 회의록, 품의서 데이터 추가 후 변경 예정 */}
            {selectedDoc?.type === "minute" &&
                renderEmpty("작성된 회의록이 없습니다.")}

            {selectedDoc?.type === "approve" &&
                renderEmpty("작성된 품의서가 없습니다.")}

            {/* {selectedDoc?.type === "minute" &&
                (minuteList.length === 0
                    ? renderEmpty("작성된 회의록이 없습니다.")
                    : minuteList.map((minute) => (
                          <ProjectMinuteItem
                              key={minute.minuteId}
                              minute={minute}
                          />
                      )))}

            {selectedDoc?.type === "approve" &&
                (approveList.length === 0
                    ? renderEmpty("결재 문서가 없습니다.")
                    : approveList.map((approve) => (
                          <ProjectApproveItem
                              key={approve.approveId}
                              approve={approve}
                          />
                      )))} */}
        </div>
    );
}
