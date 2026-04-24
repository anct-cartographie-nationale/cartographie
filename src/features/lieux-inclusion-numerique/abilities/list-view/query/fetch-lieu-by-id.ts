import { getLieuById } from '@/libraries/lieux-cache';

export const fetchLieuById = async (id: string) => getLieuById(decodeURIComponent(id));
