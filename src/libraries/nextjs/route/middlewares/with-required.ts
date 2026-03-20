import { NextResponse } from 'next/server';
import { createRequiredMiddleware } from '../../shared/middlewares/create-required-middleware';

export const withRequired = createRequiredMiddleware(() => NextResponse.json({ error: 'Not found' }, { status: 404 }));
