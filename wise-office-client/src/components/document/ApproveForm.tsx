import Image from "next/image";
import { EditableCell } from "./EditableCell";
import { LabelCell } from "./LabelCell";
import { SectionBody } from "./SectionBody";

export default function ApproveForm() {
    return (
        <div className="max-w-[718px] w-full mx-auto px-6 box-border">
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
                <table className="w-full text-[13px] table-fixed border-collapse">
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
                            <td>WISEBM2025-111201 </td>
                            <td className="text-right">결 재</td>
                            <td className="text-center">대표이사</td>
                            <td className="text-center">전 결</td>
                        </tr>
                        <tr>
                            <td className="py-1">작성일자</td>
                            <td className="py-1">2025.11.12</td>
                            <td className="py-1"></td>
                            <td className="py-1 text-center">과제책임자</td>
                            <td className="py-1"></td>
                        </tr>
                        <tr>
                            <td className="py-1">품의부서</td>
                            <td className="py-1">연구기획</td>
                            <td className="py-1 text-right">공 람</td>
                            <td className="py-1 text-center">담 당</td>
                            <td className="py-1"></td>
                        </tr>
                        <tr>
                            <td className="py-1">품 의 자</td>
                            <td className="py-1">홍길동</td>
                            <td className="py-1 text-right">접 수</td>
                            <td className="py-1 text-center">일 자</td>
                            <td className="py-1 text-center">2025.11.12</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 제목 */}
            <div className="border-b border-black mt-5 mb-5 pt-2 pl-2 text-[14px]">
                <span className="font-semibold mr-2 tracking-[6px]">
                    제 목:
                </span>
                <span className="font-semibold text-black-600">
                    2025년도 AI 자율제조 SDM 플랫폼 기술 개발사업 회의비 지출의
                    건
                </span>
            </div>

            {/* 설명 */}
            <p className="mt-6 pl-4 text-black-600 leading-7 text-[12px]">
                2025년도 AI 자율제조 SDM 플랫폼 기술 개발사업 관련하여 아래와
                같이 회의비를 지출하고자 하오니 검토 후 승인 부탁드립니다.
            </p>

            {/* 리스트 */}
            <ol className="mt-6 space-y-2 pl-8 text-black-600 list-decimal text-[12px]">
                <li>사업명 : 2025년도 AI 자율제조 SDM 플랫폼 기술 개발사업</li>
                <li>
                    과제명 : 자동차 엔진 데이터 활용 MFM 기반 SDM 실증
                    테스트베드 구축
                </li>
                <li>전담기관 : 한국산업기술평가원</li>
                <li>회의 일시 : 2025년 11월 14일</li>
                <li>
                    회의 목적 : 자동차 부품 특화 데이터 인프라 설치 및 제조 DB
                    구축 방안
                </li>
            </ol>

            {/* 끝 */}
            <div className="text-center mt-24 text-gray-600">- 끝 -</div>

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
    );
}
