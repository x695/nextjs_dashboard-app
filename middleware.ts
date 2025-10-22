import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否在仪表板路径
  const isOnDashboard = pathname.startsWith('/dashboard');
  
  // 检查是否有认证 cookie（使用更通用的 cookie 名称）
  const sessionToken = request.cookies.get('authjs.session-token') || 
                      request.cookies.get('__Secure-authjs.session-token') ||
                      request.cookies.get('next-auth.session-token') ||
                      request.cookies.get('__Secure-next-auth.session-token');
  
  const isLoggedIn = !!sessionToken;
  
  if (isOnDashboard) {
    if (isLoggedIn) {
      return NextResponse.next();
    } else {
      // 重定向到登录页面
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else if (isLoggedIn && pathname === '/login') {
    // 如果已登录且访问登录页面，重定向到仪表板
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: 'experimental-edge',
};