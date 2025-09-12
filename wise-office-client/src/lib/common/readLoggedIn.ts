export async function readLoggedIn(): Promise<boolean> {
    const res = await fetch("/api/auth/me", {
        method: "HEAD", // 바디 불필요 → HEAD로 더 가볍게
        credentials: "include", // 쿠키 포함
        cache: "no-store", // 캐시 방지
    });
    return res.headers.get("logged-in") === "true";
}
