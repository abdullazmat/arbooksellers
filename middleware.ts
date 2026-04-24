import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for admin products API routes
  // Check for admin products API routes for both POST and PUT
  if (request.nextUrl.pathname.startsWith('/api/admin/products') && (request.method === 'POST' || request.method === 'PUT')) {
    const contentLength = request.headers.get('content-length');
    
    if (contentLength) {
      const size = parseInt(contentLength);
      const maxSize = 50 * 1024 * 1024; // 50MB limit to accommodate larger images/base64 data
      
      if (size > maxSize) {
        return NextResponse.json(
          {
            error: 'Request too large',
            details: `Request size (${Math.round(size / 1024 / 1024 * 100) / 100}MB) exceeds the maximum allowed size of 50MB.`,
          },
          { status: 413 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/admin/products/:path*',
};
