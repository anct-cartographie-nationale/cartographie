import { env } from './env';

export const config = {
  projectName: 'Cartographie',
  projectSlug: 'cartographie',
  tags: ['project:cartographie', ...env.TAGS],
  email: {
    smtp: {
      host: 'smtp-relay.brevo.com',
      port: '587',
      user: 'lesbases@anct.gouv.fr'
    },
    to: 'carto@inclusion-numerique.anct.gouv.fr',
    from: 'noreply@coop-numerique.anct.gouv.fr'
  }
};
