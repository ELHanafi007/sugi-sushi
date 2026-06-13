import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ─── Admin Route Protection ───
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';
  const adminSession = request.cookies.get('admin_session');

  if (isAdminPath && !isAdminLoginPage && !adminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAdminLoginPage && adminSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // ─── Cashier Route Protection ───
  const isCashierPath = pathname.startsWith('/cashier');
  const isCashierLoginPage = pathname === '/cashier/login';
  const cashierSession = request.cookies.get('cashier_session');

  if (isCashierPath && !isCashierLoginPage && !cashierSession) {
    return NextResponse.redirect(new URL('/cashier/login', request.url));
  }

  if (isCashierLoginPage && cashierSession) {
    return NextResponse.redirect(new URL('/cashier', request.url));
  }
  
  // ─── Cuisine Route Protection ───
  const isCuisinePath = pathname.startsWith('/cuisine');
  
  if (isCuisinePath && !adminSession && !cashierSession) {
    return NextResponse.redirect(new URL('/cashier/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cashier/:path*', '/cuisine/:path*'],
};
