import { env } from './env';

export const config = {
  projectName: 'Cartographie',
  projectSlug: 'cartographie',
  tags: ['project:cartographie', ...env.TAGS]
};
