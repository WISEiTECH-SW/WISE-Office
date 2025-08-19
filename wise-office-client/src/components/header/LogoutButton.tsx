export default function LogoutButton() {
    const deleteCookie = () => {
        document.cookie = "jwt=; Max-age=0; Path=/";

        location.reload();
    };

    return (
        <button
            onClick={deleteCookie}
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-gray-100"
        >
            <span className="text-blue-700">로그아웃</span>
        </button>
    );
}
