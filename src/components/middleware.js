const { NextResponse } = require('next/server');

module.exports = function middleware(request) {
  const token = request.cookies.get('token') ? request.cookies.get('token').value : null;

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboard = request.nextUrl.pathname.startsWith('/(dashboard)') || request.nextUrl.pathname === '/';

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

module.exports.config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};