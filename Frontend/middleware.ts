import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('is_logged_in')
    const { pathname } = request.nextUrl

    const authRoutes = ['/login', '/forgot-password', '/reset-password']
    const protectedRoutes = ['/admin-akademis', '/admin-universitas', '/dosen', '/mahasiswa', '/pmb']

    if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
