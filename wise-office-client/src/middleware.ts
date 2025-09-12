import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("jwt")?.value;
    const { pathname, searchParams } = req.nextUrl;

    const protectedPath =
        pathname === "/projects" ||
        pathname.startsWith("/projects/") ||
        pathname === "/account";

    if (protectedPath && !token) {
        // 절대 URL로 생성
        const url = new URL("/", req.url);
        if (!searchParams.get("toast"))
            url.searchParams.set("toast", "login_required");

        const redirectRes = NextResponse.redirect(url);

        // 캐시 방지 (프리패치/미들웨어 캐시 모두 차단)
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
