import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/libraries/inclusion-numerique-api';
import { toLieuDetails } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-details';

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
