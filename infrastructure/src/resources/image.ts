import * as docker from '@pulumi/docker';
import { registry } from '@pulumiverse/scaleway';
import { config } from '../config';
import { name } from '../utils/name';
import { scalewayProvider } from './scaleway.provider';

const commitSha = process.env.GITHUB_SHA?.substring(0, 8) ?? 'dev';

const namespace = new registry.Namespace(
  name('registry-namespace'),
  {
    name: name('app-image-registry-namespace'),
    description: `${config.projectName} container registry`,
    isPublic: false
  },
  { provider: scalewayProvider }
);

const build = {
  context: '../',
  dockerfile: '../Dockerfile',
  platform: 'linux/amd64',
  cacheFrom: {
    images: [namespace.endpoint.apply((endpoint) => `${endpoint}/${config.projectSlug}:latest`)]
  }
};

new docker.Image(name('image-latest'), {
  build,
  imageName: namespace.endpoint.apply((endpoint) => `${endpoint}/${config.projectSlug}:latest`),
  skipPush: false,
  registry: {
    server: namespace.endpoint,
    username: process.env.SCW_ACCESS_KEY,
    password: process.env.SCW_SECRET_KEY
  }
});

const image = new docker.Image(name('image-commit'), {
  build,
  imageName: namespace.endpoint.apply((endpoint) => `${endpoint}/${config.projectSlug}:${commitSha}`),
  skipPush: false,
  registry: {
    server: namespace.endpoint,
    username: process.env.SCW_ACCESS_KEY,
    password: process.env.SCW_SECRET_KEY
  }
});

export const APP_IMAGE_NAME = image.imageName;
