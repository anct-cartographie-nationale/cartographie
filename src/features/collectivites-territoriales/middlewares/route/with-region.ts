import { NextResponse } from 'next/server';
import { type Region, regionMatchingSlug, regions } from '@/libraries/collectivites';

type ParamsContext = { params: Record<string, string> };

export const withRegion =
  (slugKey: string = 'region') =>
  async <TContext extends ParamsContext>(ctx: TContext): Promise<{ ctx: { region: Region } } | NextResponse> => {
    const slug = ctx.params[slugKey];

    if (slug === undefined) {
      return NextResponse.json({ error: 'Region slug is required' }, { status: 400 });
    }

    const region: Region | undefined = regions.find(regionMatchingSlug(slug));

    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    return { ctx: { region } };
  };
