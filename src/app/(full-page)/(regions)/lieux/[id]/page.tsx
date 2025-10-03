import { notFound, redirect } from 'next/navigation';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { departementMatchingCode } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { regionMatchingDepartement } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const id: string = (await params).id;

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(id)}` },
    select: ['code_insee']
  });

  const lieu = lieux[0];
  if (!lieu) return notFound();

  const code = lieu.code_insee.startsWith('97') ? lieu.code_insee.slice(0, 3) : lieu.code_insee.slice(0, 2);

  const departement = departements.find(departementMatchingCode(code));
  const region = regions.find(regionMatchingDepartement({ code }));

  if (!region || !departement) return notFound();

  redirect(`/${region.slug}/${departement.slug}/lieux/${id}`);
};

export default Page;
