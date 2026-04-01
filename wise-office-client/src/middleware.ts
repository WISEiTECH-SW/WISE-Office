import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("jwt")?.value;
    const { pathname, searchParams } = req.nextUrl;

    const protectedPath =
        pathname === "/projects" ||
        pathname.startsWith("/projects/") ||
        pathname === "/account" ||
        pathname.startsWith("/account/") ||
        pathname.startsWith("/overview");

    if (protectedPath && !token) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("toast", "login_required");

        const redirectRes = NextResponse.redirect(loginUrl);
        redirectRes.headers.set("x-middleware-cache", "no-cache");
        redirectRes.headers.set("Cache-Control", "no-store");
        redirectRes.headers.set("Vary", "Cookie");
        return redirectRes;
    }

    const res = NextResponse.next();

    res.headers.set("logged-in", token ? "true" : "false");

    res.headers.set("x-middleware-cache", "no-cache");
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("Vary", "Cookie");
    return res;
}

export const config = {
    // ✅ API 라우트까지 타지 않게 하려면 /api 도 제외 권장
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
