export default function ErrorIndicator() {
    return (
        <div className="md:px-6">
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-sm px-10 py-12 text-center">
                    <p className="text-lg font-semibold text-gray-800">
                        프로젝트를 찾을 수 없습니다.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        접근 권한이 없거나 삭제된 프로젝트입니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
