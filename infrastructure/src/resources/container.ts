import { containers } from '@pulumiverse/scaleway';
import { config } from '../config';
import { name } from '../utils/name';
import { APP_IMAGE_NAME } from './image';
import { scalewayProvider } from './scaleway.provider';

const namespace = new containers.Namespace(
  name('container-namespace'),
  {
    name: name('app-container-namespace'),
    description: `${config.projectName} serverless container namespace`,
    tags: config.tags
  },
  { provider: scalewayProvider }
);

const container = new containers.Container(
  name('container'),
  {
    name: name('app-container'),
    description: `${config.projectName} serverless container instance`,
    tags: config.tags,
    namespaceId: namespace.id,
    registryImage: APP_IMAGE_NAME,
    cpuLimit: 2240,
    memoryLimit: 4096,
    minScale: 1,
    maxScale: 5,
    maxConcurrency: 10,
    port: 80,
    protocol: 'http1',
    environmentVariables: {
      HOSTNAME: '0.0.0.0'
    },
    healthChecks: [
      {
        https: [{ path: '/api/health' }],
        failureThreshold: 3,
        interval: '10s'
      }
    ]
  },
  { provider: scalewayProvider }
);

export const APP_URL = container.domainName.apply((domain) => `https://${domain}`);
