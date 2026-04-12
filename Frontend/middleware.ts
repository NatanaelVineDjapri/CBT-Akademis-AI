import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const authRoutes = ['/login', '/forgot-password', '/reset-password']
    const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

    const hasSession = request.cookies.has('laravel_session')

    if (!hasSession && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // if (hasSession && isAuthRoute) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

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
