import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

const protectedRoutes = ["/dashboard", "/tasks", "/checklist"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/checklist/:path*", "/login", "/register"]
};
