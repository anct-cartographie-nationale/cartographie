import { type NextRequest, NextResponse } from 'next/server';

export const proxy = (request: NextRequest) => {
  const response = NextResponse.next();
  response.headers.set('x-url', request.url);
  return response;
};

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|manifest.webmanifest).*)'
  ]
};
