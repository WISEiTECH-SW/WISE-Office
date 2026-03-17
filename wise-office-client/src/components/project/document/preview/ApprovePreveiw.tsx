import Button from "@/components/common/Button";
import { ApproveDetailResponse } from "@/types/document";
import Image from "next/image";
import BasePreview from "./BasePreview";
import { Edit, Printer, FileSearch } from "lucide-react";

interface Props {
    approve?: ApproveDetailResponse;
    isAttending: boolean;
    onEdit: (docType: string, docId: number) => void;
    onSelectMinute: (minutesId: number) => void;
}

export default function ApprovePreview({
    approve,
    isAttending,
    onEdit,
    onSelectMinute,
}: Props) {
    if (!approve) {
        return <BasePreview type="approve" />;
    }

    return (
        <div className="rounded-lg shadow-sm">
            {isAttending && (
                <div className="flex rounded-t-lg flex-row gap-4 p-4 bg-white/80">
                    <Button
                        label="회의록 조회"
                        onClick={() => onSelectMinute(approve.minutesId)}
                        variant="primary"
                        icon={<FileSearch className="w-4 h-4" />}
                    />
                    <Button
                        label="출력"
                        onClick={() => {
                            window.print();
                        }}
                        variant="primary"
                        icon={<Printer className="w-4 h-4" />}
                    />
                    <Button
                        label="수정"
                        onClick={() => onEdit("approve", approve.minutesId)}
                        variant="secondary"
                        icon={<Edit className="h-4 w-4" />}
                    />
                </div>
            )}
            <div className="p-4 rounded-b-lg bg-blue-50">
                <div className="print-area">
                    {/* 품의서 */}
                    <div className="print-area">
                        <div className="max-w-[718px] w-full mx-auto p-12 box-border bg-white">
                            {/* 제목 */}
                            <div className="flex flex-col items-center mt-6">
                                <div className="inline-block relative">
                                    <div className="text-[32px] tracking-[22px] font-bold text-center mr-[-22px]">
                                        품 의 서
                                    </div>

                                    {/* 밑줄 */}
                                    <div className="flex flex-col items-center mt-1">
                                        <div className="w-full border-b-2 border-black"></div>
                                        <div className="w-full border-b-2 border-black mt-[3px]"></div>
                                    </div>
                                </div>
                            </div>
                            {/* 회색 바 */}
                            <div className="w-full h-[20px] bg-[#E1E1E1] mt-6 mb-2" />

                            {/* 상단 정보 */}
                            <div className="pl-4">
                                <table className="w-full text-[16px] table-fixed border-collapse">
                                    <colgroup>
                                        <col className="w-[90px]" />
                                        <col />
                                        <col className="w-[70px]" />
                                        <col className="w-[120px]" />
                                        <col className="w-[90px]" />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>문서번호</td>
                                            <td className="w-full outline-none">
                                                {approve.approveNo}
                                            </td>
                                            <td className="text-right">
                                                결 재
                                            </td>
                                            <td className="text-center">
                                                대표이사
                                            </td>
                                            <td className="text-center">
                                                전 결
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">작성일자</td>
                                            <td className="py-1 w-full outline-none">
                                                {approve.writtenAt}
                                            </td>
                                            <td className="py-1"></td>
                                            <td className="py-1 text-center">
                                                과제책임자
                                            </td>
                                            <td className="py-1"></td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">품의부서</td>
                                            <td className="py-1">연구기획</td>
                                            <td className="py-1 text-right">
                                                공 람
                                            </td>
                                            <td className="py-1 text-center">
                                                담 당
                                            </td>
                                            <td className="py-1"></td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">품 의 자</td>
                                            <td className="py-1 w-full outline-none">
                                                {approve.writer}
                                            </td>
                                            <td className="py-1 text-right">
                                                접 수
                                            </td>
                                            <td className="py-1 text-center">
                                                일 자
                                            </td>
                                            <td className="py-1 text-center outline-none">
                                                {approve.submitAt}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 제목 */}
                            <div className="border-b border-black mt-5 mb-5 pt-2 pl-2 text-[16px]">
                                <span className="font-semibold mr-2 tracking-[6px]">
                                    제 목:
                                </span>
                                <span className="font-semibold text-black-600">
                                    {approve.title} 회의비 지출의 건
                                </span>
                            </div>

                            {/* 설명 */}
                            <p className="mt-6 pl-5 pr-5 text-black-600 leading-7 text-[15px]">
                                {approve.title} 관련하여 아래와 같이 회의비를
                                지출하고자 하오니 검토 후 승인 부탁드립니다.
                            </p>

                            {/* 리스트 */}
                            <ol className="mt-6 space-y-2 pl-16 text-black-600 list-decimal text-[15px]">
                                <li>사업명 :{approve.businessName}</li>
                                <li>과제명 :{approve.title}</li>
                                <li>전담기관 :{approve.institution}</li>
                                <li>회의 일시 :{approve.minutesAt}</li>
                                <li>회의 목적 :{approve.minutesPurpose}</li>
                            </ol>

                            {/* 끝 */}
                            <div className="text-center mt-24 text-gray-600  text-[15px]">
                                - 끝 -
                            </div>

                            {/* 로고 */}
                            <div className="flex justify-end mt-60">
                                <Image
                                    src="/wiseitechLogo.png"
                                    alt="logo"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-[140px] h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
