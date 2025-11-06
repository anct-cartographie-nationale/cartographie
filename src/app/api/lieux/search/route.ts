import { NextResponse } from 'next/server';
import { z } from 'zod';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

export const GET = async (request: Request) => {
  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());

  const parsed = searchSchema.safeParse(searchParams);
  if (!parsed.success) return NextResponse.json({ error: z.treeifyError(parsed.error).properties }, { status: 422 });

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    select: ['id', 'nom', 'latitude', 'longitude', 'adresse', 'code_postal', 'code_insee', 'commune'],
    filter: { nom: `ilike.%${parsed.data.q}%` },
    paginate: { limit: 10, offset: 0 }
  });

  return Response.json(lieux);
};
