import { DocumentType, SelectedDocument } from "@/types/project";
import { Log } from "@/types/log";
import { ApproveListResponse, MinutesListResponse } from "@/types/document";
import LogItem from "./list-item/LogItem";
import MinuteItem from "./list-item/MinuteItem";
import ApproveItem from "./list-item/ApproveItem";

interface DocumentListProps {
    selectedDoc: SelectedDocument;
    docData: {
        logList: Log[];
        minutesList: MinutesListResponse[];
        approvalsList: ApproveListResponse[];
    };
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
                {`작성된 ${text} 없습니다.`}
            </p>
        </div>
    );

    const handleSelectDoc = (type: DocumentType, id: number) => {
        onSelectDoc(type, id);
    };

    return (
        <div className="md:max-h-90 flex flex-nowrap pb-1 overflow-x-auto md:flex-col scrollbar-auto-hide">
            {selectedDoc.type === "log" &&
                (docData.logList.length === 0
                    ? renderEmpty("로그가")
                    : docData.logList.map((log) => (
                          <LogItem
                              key={log.logId}
                              log={log}
                              isSelected={selectedDoc.id === log.logId}
                              onSelect={handleSelectDoc}
                          />
                      )))}

            {selectedDoc.type === "minute" &&
                (docData.minutesList.length === 0
                    ? renderEmpty("회의록이")
                    : docData.minutesList.map((minutes) => (
                          <MinuteItem
                              key={minutes.minutesId}
                              minute={minutes}
                              isSelected={selectedDoc.id === minutes.minutesId}
                              onSelect={handleSelectDoc}
                          />
                      )))}

            {selectedDoc.type === "approve" &&
                (docData.approvalsList.length === 0
                    ? renderEmpty("품의서가")
                    : docData.approvalsList.map((approval) => (
                          <ApproveItem
                              key={approval.approveId}
                              approve={approval}
                              isSelected={selectedDoc.id === approval.approveId}
                              onSelect={handleSelectDoc}
                          />
                      )))}
        </div>
    );
}
