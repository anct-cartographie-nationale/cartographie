import { notFound } from 'next/navigation';
import type { PageProps } from '@/libraries/next/page';
import { type Region, regionMatchingSlug, regions } from '../../domain';

export const withRegion =
  (slugKey: string = 'region') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { region: Region } }> => {
    const params = await props.params;
    const slug = params[slugKey];

    if (slug === undefined) {
      notFound();
    }

    const region: Region | undefined = regions.find(regionMatchingSlug(slug));

    if (!region) {
      notFound();
    }

    return { ctx: { region } };
  };
