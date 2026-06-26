import { routeBuilder } from '@arckit/nextjs/route';
import { getSources } from '@/libraries/lieux-cache';

export const GET = routeBuilder().handle(async () => Response.json({ sources: await getSources() }));
