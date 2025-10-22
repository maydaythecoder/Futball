// SECURITY: Middleware for protected routes and role-based access control
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For MVP with mock data, allow all dashboard routes
  // In production, check session cookie and validate user role
  
  // Example of role-based route protection (to be enabled with Firebase Auth):
  // const session = request.cookies.get('session')?.value;
  // if (!session) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // Admin-only routes
  if (pathname.startsWith("/dashboard/admin")) {
    // In production: check if user role is 'admin'
    // For now, allow in MVP mode
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

