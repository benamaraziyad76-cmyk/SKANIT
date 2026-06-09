import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication and their required roles
const PROTECTED_ROUTES: { pattern: RegExp; roles: string[] }[] = [
  { pattern: /^\/admin\//, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER'] },
  { pattern: /^\/kitchen\//, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'KITCHEN'] },
  { pattern: /^\/waiter\//, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER'] },
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Check if route is protected
  const protectedRoute = PROTECTED_ROUTES.find(r => r.pattern.test(pathname));
  if (!protectedRoute) return NextResponse.next();

  // Authenticate the request

  // Get token from cookies
  const token = req.cookies.get('sa_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL(`/login?to=${encodeURIComponent(pathname)}`, req.url));
  }

  const user = await verifyToken(token);

  if (!user) {
    const response = NextResponse.redirect(new URL(`/login?to=${encodeURIComponent(pathname)}`, req.url));
    response.cookies.delete('sa_token');
    return response;
  }

  // Check role
  if (!protectedRoute.roles.includes(user.role)) {
    // Redirect to appropriate dashboard
    let redirectTo = '/login';
    if (user.role === 'SUPER_ADMIN') redirectTo = '/superadmin';
    else if (user.role === 'OWNER' || user.role === 'MANAGER') redirectTo = `/admin/${user.restaurantSlug}`;
    else if (user.role === 'KITCHEN') redirectTo = `/kitchen/${user.restaurantSlug}`;
    else if (user.role === 'WAITER') redirectTo = `/waiter/${user.restaurantSlug}`;
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // Add user info to headers for server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', user.userId);
  requestHeaders.set('x-user-role', user.role);
  requestHeaders.set('x-user-restaurant', user.restaurantId || '');
  requestHeaders.set('x-user-restaurant-slug', user.restaurantSlug || '');

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/superadmin/:path*', '/admin/:path*', '/kitchen/:path*', '/waiter/:path*'],
};
