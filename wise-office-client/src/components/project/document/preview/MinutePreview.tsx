import { MinutesDetail } from "@/types/document";
import BasePreview from "./BasePreview";
import Button from "@/components/common/Button";

interface MinutePreviewProps {
    projectId: number;
    minuteDetail: MinutesDetail | undefined;
}

export default function MinutePreview({
    projectId,
    minuteDetail,
}: MinutePreviewProps) {
    if (!minuteDetail) {
        return <BasePreview type="minute" />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col p-4 md:pt-6">
                <div className="flex flex-row gap-4">
                    <Button
                        label="품의서 생성"
                        onClick={() => {}}
                        variant="primary"
                    />
                    <Button
                        label="출력하기"
                        onClick={() => {}}
                        variant="secondary"
                    />
                    <Button
                        label="수정하기"
                        onClick={() => {}}
                        variant="primary"
                    />
                    <Button
                        label="삭제하기"
                        onClick={() => {}}
                        variant="danger"
                    />
                </div>
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
