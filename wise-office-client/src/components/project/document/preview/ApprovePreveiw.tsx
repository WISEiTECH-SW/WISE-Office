import BasePreview from "./BasePreview";

interface ApprovePreviewProps {
    projectId: number;
    approveDetail: string | undefined;
}

export default function ApprovePreview({
    projectId,
    approveDetail,
}: ApprovePreviewProps) {
    if (!approveDetail) {
        return <BasePreview type="approve" />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col pt-6 md:pt-6">
                <h2>품의서 선택</h2>
                <div>프로젝트 ID : {projectId}</div>
            </div>
        </div>
    );
}
