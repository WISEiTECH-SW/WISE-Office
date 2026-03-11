import { DocumentType, SelectedDocument } from "@/types/project";
import { Log } from "@/types/log";
import { MinutesListResponse } from "@/types/document";
import LogItem from "./list-item/LogItem";
import MinuteItem from "./list-item/MinuteItem";

interface DocumentListProps {
    selectedDoc: SelectedDocument | null;
    docData: { logList: Log[]; minuteList: MinutesListResponse[] };
    onSelectDoc: (type: DocumentType, id: number) => void;
}

export default function DocumentList({
    selectedDoc,
    docData,
    onSelectDoc,
}: DocumentListProps) {
    const renderEmpty = (text: string) => (
        <div className="flex flex-1 items-center justify-center py-4 md:py-10">
            <p className="text-gray-400 text-sm md:text-base font-medium">
                {text}
            </p>
        </div>
    );

    const handleSelectDoc = (type: DocumentType, id: number) => {
        onSelectDoc(type, id);
    };

    return (
        <div className="md:max-h-85 flex flex-nowrap pb-1 overflow-x-auto md:flex-col scrollbar-auto-hide">
            {(selectedDoc?.type === "log" || !selectedDoc) &&
                (docData.logList.length === 0
                    ? renderEmpty("작성된 로그가 없습니다.")
                    : docData.logList.map((log) => (
                          <LogItem
                              key={log.logId}
                              log={log}
                              isSelected={
                                  selectedDoc
                                      ? selectedDoc.id === log.logId
                                      : false
                              }
                              onSelect={handleSelectDoc}
                          />
                      )))}

            {selectedDoc?.type === "minute" &&
                (docData.minuteList.length === 0
                    ? renderEmpty("작성된 회의록이 없습니다.")
                    : docData.minuteList.map((minute) => (
                          <MinuteItem
                              key={minute.minutesId}
                              minute={minute}
                              isSelected={
                                  selectedDoc
                                      ? selectedDoc.id === minute.minutesId
                                      : false
                              }
                              onSelect={handleSelectDoc}
                          />
                      )))}

            {selectedDoc?.type === "approve" &&
                renderEmpty("작성된 품의서가 없습니다.")}

            {/* {selectedDoc?.type === "approve" &&
                (approveList.length === 0
                    ? renderEmpty("작성된 품의서가 없습니다.")
                    : approveList.map((approve) => (
                          <ProjectApproveItem
                              key={approve.approveId}
                              approve={approve}
                          />
                      )))} */}
        </div>
    );
}
