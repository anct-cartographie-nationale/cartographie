import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { toLieuDetails } from '@/external-api/inclusion-numerique/transfer/to-lieu-details';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';

const fetchLieu = async (id: string) => {
  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(id)}` }
  });

  const lieu = lieux[0];
  if (!lieu) return null;

  return toLieuDetails(appendCollectivites(lieu));
};

const getCachedLieu = (id: string) =>
  unstable_cache(() => fetchLieu(id), ['lieu', id], {
    revalidate: 21600,
    tags: ['lieu']
  })();

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const GET = async (_request: Request, { params }: RouteParams) => {
  const { id } = await params;

  const lieu = await getCachedLieu(id);

  if (!lieu) {
    return NextResponse.json({ error: 'Lieu not found' }, { status: 404 });
  }

  return Response.json(lieu);
};
