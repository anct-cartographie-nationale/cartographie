import { redirect } from 'next/navigation';
import { type Departement, departements, type Region, regionMatchingDepartement, regions } from '@/libraries/collectivites';
import type { PageProps } from '@/libraries/nextjs/page';
import { normalizeLegacyParam } from './normalize-legacy-param';

export const withLegacyDepartement =
  (paramKey: string = 'departement') =>
  async <TContext extends { region: Region }>(
    ctx: TContext,
    props: PageProps
  ): Promise<{ ctx: { departement: Departement } }> => {
    const params = await props.params;
    const param = params[paramKey];

    if (param == null) redirect(`/${ctx.region.slug}`);

    const normalizedParam = normalizeLegacyParam(decodeURIComponent(param));
    const departement = departements.find((d) => normalizeLegacyParam(d.nom) === normalizedParam);

    return departement ? { ctx: { departement } } : redirect(`/${ctx.region.slug}`);
  };

export const withLegacyDepartementOnly =
  (paramKey: string = 'departement') =>
  async <TContext extends object>(
    _ctx: TContext,
    props: PageProps
  ): Promise<{ ctx: { departement: Departement; region: Region } }> => {
    const params = await props.params;
    const param = params[paramKey];

    if (param == null) redirect('/');

    const normalizedParam = normalizeLegacyParam(decodeURIComponent(param));
    const departement = departements.find((d) => normalizeLegacyParam(d.nom) === normalizedParam);

    if (!departement) redirect('/');

    const region = regions.find(regionMatchingDepartement(departement));

    return region ? { ctx: { departement, region } } : redirect('/');
  };
