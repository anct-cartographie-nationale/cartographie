import type { PageProps } from '@arckit/nextjs/page';
import { redirect } from 'next/navigation';

export const withLegacyId =
  (paramKey: string = 'id') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { id: string } }> => {
    const params = await props.params;

    const id = params[paramKey];

    return id == null ? redirect('/') : { ctx: { id } };
  };
