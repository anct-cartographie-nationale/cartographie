import { notFound } from 'next/navigation';
import {
  type Departement,
  departementMatchingSlug,
  departements,
  regionMatchingDepartement,
  regionMatchingSlug,
  regions
} from '@/libraries/collectivites';
import type { PageProps } from '@/libraries/nextjs/page';

export const withDepartement =
  (slugKey: string = 'departement', regionSlugKey: string = 'region') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { departement: Departement } }> => {
    const params = await props.params;
    const slug = params[slugKey];

    if (slug === undefined) return notFound();

    const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

    if (!departement) return notFound();

    const regionSlug = params[regionSlugKey];
    if (regionSlug !== undefined) {
      const region = regions.find(regionMatchingSlug(regionSlug));
      if (region && !regionMatchingDepartement(departement)(region)) return notFound();
    }

    return { ctx: { departement } };
  };
