export default function Profile() {
    return (
        <div className="rounded-full border border-gray-300 bg-white px-2 py-2 shadow-sm hover:bg-gray-100">
            {/* TODO : /api/me 에서 imagleUrl 가져오기 */}
            <img
                src="/assets/Google.png"
                alt="Google Logo"
                className="h-5 w-5"
            />
        </div>
    );
}
