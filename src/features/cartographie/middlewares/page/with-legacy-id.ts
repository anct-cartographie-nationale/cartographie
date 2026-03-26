import { redirect } from 'next/navigation';
import type { PageProps } from '@/libraries/nextjs/page';

export const withLegacyId =
  (paramKey: string = 'id') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { id: string } }> => {
    const params = await props.params;

    const id = params[paramKey];

    return id == null ? redirect('/') : { ctx: { id } };
  };
