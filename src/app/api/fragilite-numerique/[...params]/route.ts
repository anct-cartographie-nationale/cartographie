import type { NextRequest } from 'next/server';

const FRAGILITE_NUMERIQUE_API_URL = 'https://fragilite-numerique.fr/api/tiles';
const QUERY_PARAMS =
  '?filters[]=no_thd_coverage_rate&filters[]=no_4g_coverage_rate&filters[]=poverty_rate&filters[]=older_65_rate&filters[]=nscol15p_rate&variation=all';

export const GET = async (_: NextRequest, context: { params: Promise<{ params: string[] }> }) => {
  const [source, z, x, y] = (await context.params).params;

  const upstream = await fetch(`${FRAGILITE_NUMERIQUE_API_URL}/${source}/${z}/${x}/${y}${QUERY_PARAMS}`);
  const arrayBuffer = await upstream.arrayBuffer();

  return new Response(Buffer.from(arrayBuffer), { headers: { 'content-type': 'application/vnd.mapbox-vector-tile' } });
};
