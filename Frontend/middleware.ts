import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('laravel_session')
    const { pathname } = request.nextUrl

    const authRoutes = ['/login', '/forgot-password', '/reset-password']
    const protectedRoutes = ['/admin-akademis', '/admin-universitas', '/dosen', '/mahasiswa', '/pmb']

    if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Karena session mungkin sudah tidak valid di server
    if (session && authRoutes.some(route => pathname.startsWith(route))) {
        // Jangan redirect, biarkan lewat
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}