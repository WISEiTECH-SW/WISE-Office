export default function AddProjectButton() {
    return (
        <button className="px-4 py-2.5 w-auto text-m font-medium text-white inline-flex items-center bg-blue-500 shadow-m hover:bg-blue-600 rounded-lg text-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                    d="M12 5v14m-7-7h14"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
            프로젝트 생성
        </button>
    );
}
