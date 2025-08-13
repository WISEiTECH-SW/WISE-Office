export default function GoogleLoginButton() {
    const server = process.env.SERVER_URL ?? "http://localhost:8080";
    const loginUrl = `${server}/oauth2/authorization/google`;

    return (
        <a
            href={loginUrl}
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-gray-100"
            style={{ width: "fit-content" }}
        >
            <img
                src="/assets/Google.png"
                alt="Google Logo"
                className="h-5 w-5"
            />
            <span className="text-blue-700">Sign in with Google</span>
        </a>
    );
}
