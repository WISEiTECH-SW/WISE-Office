import { MinutesDetail } from "@/types/document";
import BasePreview from "./BasePreview";
import Button from "@/components/common/Button";
import { DeleteModalState } from "@/types/project";
import { useApproveCreation } from "@/hooks/project/useDocuments";

interface MinutePreviewProps {
    projectId: number;
    minuteDetail: MinutesDetail | undefined;
    isAttending: boolean;
    onEdit: (docType: string, docId: number) => void;
    onDelete: (deleteTarget: DeleteModalState) => void;
}

export default function MinutePreview({
    projectId,
    minuteDetail,
    isAttending,
    onEdit,
    onDelete,
}: MinutePreviewProps) {
    const createApprove = useApproveCreation();
    if (!minuteDetail) {
        return <BasePreview type="minute" />;
    }
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col p-4 md:pt-6">
                {isAttending && (
                    <div className="flex flex-row gap-4">
                        <Button
                            label="품의서 생성"
                            onClick={() =>
                                createApprove.mutate({
                                    projectId: Number(projectId),
                                    minutesId: minuteDetail.minutesId,
                                })
                            }
                            variant="primary"
                        />
                        <Button
                            label="출력하기"
                            onClick={() => {
                                window.print();
                            }}
                            variant="secondary"
                        />
                        <Button
                            label="수정하기"
                            onClick={() =>
                                onEdit("minute", minuteDetail.minutesId)
                            }
                            variant="primary"
                        />
                        <Button
                            label="삭제하기"
                            onClick={() =>
                                onDelete({
                                    type: "minute",
                                    id: minuteDetail.minutesId,
                                })
                            }
                            variant="danger"
                        />
                    </div>
                )}

                <div>
                    <h2>회의록</h2>
                    <div>프로젝트 ID : {projectId} </div>
                    {/* minuteDetail 정보 */}
                    <table>
                        <tbody>
                            {Object.entries(minuteDetail).map(
                                ([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
