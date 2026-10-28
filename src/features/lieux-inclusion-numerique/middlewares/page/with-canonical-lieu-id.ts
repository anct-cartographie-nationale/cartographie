import type { PageProps } from '@arckit/nextjs/page';
import { permanentRedirect } from 'next/navigation';
import type { Departement, Region } from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';

type CanonicalLieuIdContext = {
  id: string;
  lieu: { id: string };
  region: Region;
  departement: Departement;
  urlSearchParams: URLSearchParams;
};

export const withCanonicalLieuId =
  () =>
  async <TContext extends CanonicalLieuIdContext>(
    { id, lieu, region, departement, urlSearchParams }: TContext,
    _props: PageProps
  ): Promise<{ ctx: object }> =>
    decodeURIComponent(id) === lieu.id
      ? { ctx: {} }
      : permanentRedirect(
          hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/${encodeURIComponent(lieu.id)}`)(urlSearchParams)
        );
