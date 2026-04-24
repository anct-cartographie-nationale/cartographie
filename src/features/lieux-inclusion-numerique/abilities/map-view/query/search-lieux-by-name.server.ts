import { getAllLieux } from '@/libraries/lieux-cache';

export const searchLieuxByName = async (query: string) => {
  const allLieux = await getAllLieux();
  const lowerQuery = query.toLowerCase();
  return allLieux.filter((lieu) => lieu.nom.toLowerCase().includes(lowerQuery)).slice(0, 10);
};
