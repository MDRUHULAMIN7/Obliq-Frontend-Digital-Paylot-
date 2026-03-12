import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import type { PermissionAtom, User } from './types';

type TokenPayload = {
  permissions?: PermissionAtom[];
  role?: string;
  user?: User;
};

const permissionMap: Record<string, PermissionAtom> = {
  '/dashboard': 'dashboard:view',
  '/leads': 'leads:view',
  '/tasks': 'tasks:view',
  '/reports': 'reports:view',
  '/users': 'users:view',
  '/audit': 'audit:view',
  '/settings': 'settings:view',
};

const publicRoutes = ['/login', '/403'];

const getRequiredPermission = (pathname: string) => {
  const match = Object.keys(permissionMap).find((path) =>
    pathname.startsWith(path),
  );
  return match ? permissionMap[match] : null;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get('accessToken')?.value ??
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let payload: TokenPayload;
  try {
    payload = jwtDecode<TokenPayload>(token);
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const required = getRequiredPermission(pathname);
  if (!required) {
    return NextResponse.next();
  }

  const permissions = payload.permissions ?? payload.user?.permissions ?? [];
  const role = payload.role ?? payload.user?.role;

  if (pathname.startsWith('/audit') && role !== 'admin') {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  if (role === 'admin' || permissions.includes(required)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/403', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
