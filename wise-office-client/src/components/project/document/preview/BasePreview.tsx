import { DocumentType } from "@/types/project";
import { ClipboardList } from "lucide-react";

interface BasePreviewProps {
    type: DocumentType;
}

export default function BasePreview({ type }: BasePreviewProps) {
    const docTypeLabel: Record<DocumentType, string> = {
        log: "로그를",
        minute: "회의록을",
        approve: "품의서를",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <ClipboardList className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm md:text-base font-medium">
                {`${docTypeLabel[type]} 선택해주세요`}
            </p>
        </div>
    );
}
