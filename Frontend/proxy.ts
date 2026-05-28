import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const roleRoutes: Record<string, string> = {
  admin_akademis_ai: '/admin-akademis',
  admin_universitas: '/admin-universitas',
  dosen: '/dosen',
  mahasiswa: '/mahasiswa',
  peserta_mahasiswa_baru: '/pmb',
};

const rolePrefixes = Object.values(roleRoutes);

async function getRoleFromSession(request: NextRequest): Promise<string | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
  const origin = request.nextUrl.origin;
  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        'Cookie': request.headers.get('cookie') ?? '',
        'Accept': 'application/json',
        'Origin': origin,
        'Referer': `${origin}/`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user?.role ?? null;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const authRoutes = ['/login', '/forgot-password', '/reset-password']
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  const hasSession = request.cookies.has('laravel_session')

  if (!hasSession && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasSession && isAuthRoute) {
    const role = await getRoleFromSession(request)
    if (role && roleRoutes[role]) {
      return NextResponse.redirect(new URL(roleRoutes[role], request.url))
    }
  }

  const isRoleProtectedPath = rolePrefixes.some(p => pathname.startsWith(p))

  if (hasSession && isRoleProtectedPath) {
    const role = await getRoleFromSession(request)

    if (role && roleRoutes[role]) {
      const allowedPrefix = roleRoutes[role]
      if (!pathname.startsWith(allowedPrefix)) {
        return NextResponse.redirect(new URL(allowedPrefix, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/admin-akademis/:path*',
    '/admin-universitas/:path*',
    '/dosen/:path*',
    '/mahasiswa/:path*',
    '/pmb/:path*',
    '/login',
    '/forgot-password',
    '/reset-password',
  ]
}
