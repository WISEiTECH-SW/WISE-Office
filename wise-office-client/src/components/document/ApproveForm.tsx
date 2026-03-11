import ApprovalSeal from "./ApprovalSeal";

export default function ApproveForm() {
    return (
        <div>
            {/* 결제 란 */}
            <ApprovalSeal />

            {/* 제목 */}
            <div className="text-center font-serif font-bold text-2xl tracking-[12px] mb-1 text-black">
                품 의 서
            </div>
            <div className="w-3/5 mx-auto h-1 bg-gradient-to-r from-black via-white to-black mb-6" />
        </div>
    );
}
