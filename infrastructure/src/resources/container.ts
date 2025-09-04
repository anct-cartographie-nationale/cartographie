import { containers } from '@pulumiverse/scaleway';
import { config } from '../config';
import { APP_IMAGE_NAME } from './image';
import { scalewayProvider } from './scaleway.provider';

const namespace = new containers.Namespace(
  `${config.projectSlug}-container-namespace`,
  {
    name: `${config.projectSlug}-namespace`,
    description: `${config.projectName} serverless container namespace`,
    tags: config.tags
  },
  { provider: scalewayProvider }
);

const container = new containers.Container(
  `${config.projectSlug}-app-container`,
  {
    name: config.projectSlug,
    description: `${config.projectName} serverless container instance`,
    tags: config.tags,
    namespaceId: namespace.id,
    registryImage: APP_IMAGE_NAME,
    minScale: 1,
    maxScale: 3,
    port: 3000,
    protocol: 'http1',
    environmentVariables: {
      HOSTNAME: '0.0.0.0'
    }
  },
  { provider: scalewayProvider }
);

export const APP_URL = container.domainName.apply((domain) => `https://${domain}`);
