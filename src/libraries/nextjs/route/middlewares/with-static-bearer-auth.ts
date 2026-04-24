import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const withStaticBearerAuth =
  (expectedToken: string) =>
  async (_ctx: object, request: NextRequest): Promise<{ ctx: object } | NextResponse> => {
    const authorization = request.headers.get('Authorization');
    if (!authorization) return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) return NextResponse.json({ error: 'Invalid Authorization scheme' }, { status: 401 });
    if (token !== expectedToken) return NextResponse.json({ error: 'Invalid token' }, { status: 403 });

    return { ctx: {} };
  };
