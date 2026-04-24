import { cache } from 'react';
import { getLieuById } from '@/libraries/lieux-cache';

export const fetchLieuDetails = cache(async (id: string) => getLieuById(decodeURIComponent(id)));
