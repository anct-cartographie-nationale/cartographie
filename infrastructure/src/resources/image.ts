import * as docker from '@pulumi/docker';
import { registry } from '@pulumiverse/scaleway';
import { config } from '../config';
import { scalewayProvider } from './scaleway.provider';

const namespace = new registry.Namespace(
  `${config.projectSlug}-registry-namespace`,
  {
    name: `${config.projectSlug}-container-registry`,
    description: `${config.projectName} container registry`,
    isPublic: false
  },
  { provider: scalewayProvider }
);

const image = new docker.Image(`${config.projectSlug}-image`, {
  build: {
    context: '../',
    dockerfile: '../Dockerfile',
    platform: 'linux/amd64',
    cacheFrom: {
      images: [namespace.endpoint.apply((endpoint) => `${endpoint}/${config.projectSlug}:latest`)]
    }
  },
  imageName: namespace.endpoint.apply((endpoint) => `${endpoint}/${config.projectSlug}:latest`),
  skipPush: false,
  registry: {
    server: namespace.endpoint,
    username: process.env.SCW_ACCESS_KEY,
    password: process.env.SCW_SECRET_KEY
  }
});

export const APP_IMAGE_NAME = image.imageName;
