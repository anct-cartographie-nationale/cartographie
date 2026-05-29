import type { PageProps } from '@arckit/nextjs/page';
import { notFound } from 'next/navigation';
import { type Region, regionMatchingSlug, regions } from '@/libraries/collectivites';

export const withRegion =
  (slugKey: string = 'region') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { region: Region } }> => {
    const params = await props.params;
    const slug = params[slugKey];

    if (slug === undefined) return notFound();

    const region: Region | undefined = regions.find(regionMatchingSlug(slug));

    return region ? { ctx: { region } } : notFound();
  };
