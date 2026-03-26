import { redirect } from 'next/navigation';
import { type Region, regions } from '@/libraries/collectivites';
import type { PageProps } from '@/libraries/nextjs/page';
import { normalizeLegacyParam } from './normalize-legacy-param';

export const withLegacyRegion =
  (paramKey: string = 'region') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { region: Region } }> => {
    const params = await props.params;
    const param = params[paramKey];

    if (param == null) redirect('/');

    const region = regions.find((r) => normalizeLegacyParam(r.nom) === normalizeLegacyParam(decodeURIComponent(param)));

    return region ? { ctx: { region } } : redirect('/');
  };
