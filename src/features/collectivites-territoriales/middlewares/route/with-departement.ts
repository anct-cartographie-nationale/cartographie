import { NextResponse } from 'next/server';
import {
  type Departement,
  departementMatchingSlug,
  departements,
  regionMatchingDepartement,
  regionMatchingSlug,
  regions
} from '@/libraries/collectivites';

type ParamsContext = { params: Record<string, string> };

export const withDepartement =
  (slugKey: string = 'departement', regionSlugKey: string = 'region') =>
  async <TContext extends ParamsContext>(ctx: TContext): Promise<{ ctx: { departement: Departement } } | NextResponse> => {
    const slug = ctx.params[slugKey];

    if (slug === undefined) {
      return NextResponse.json({ error: 'Departement slug is required' }, { status: 400 });
    }

    const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

    if (!departement) {
      return NextResponse.json({ error: 'Departement not found' }, { status: 404 });
    }

    const regionSlug = ctx.params[regionSlugKey];
    if (regionSlug !== undefined) {
      const region = regions.find(regionMatchingSlug(regionSlug));
      if (region && !regionMatchingDepartement(departement)(region)) {
        return NextResponse.json({ error: 'Departement not in region' }, { status: 404 });
      }
    }

    return { ctx: { departement } };
  };
