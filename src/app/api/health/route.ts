import { getCacheStatus } from '@/libraries/lieux-cache';

export const GET = () => Response.json({ status: 'ok', cache: getCacheStatus() });
