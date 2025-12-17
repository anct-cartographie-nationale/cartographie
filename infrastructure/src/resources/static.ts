import { object } from '@pulumiverse/scaleway';
import { config } from '../config';
import { name } from '../utils/name';
import { scalewayProvider } from './scaleway.provider';

const bucket = new object.Bucket(
  name('app-static-assets'),
  {
    tags: Object.fromEntries(config.tags.map((tag) => [tag, tag])),
    name: name('app-static-assets'),
    region: 'fr-par'
  },
  { provider: scalewayProvider }
);

new object.BucketAcl(
  name('app-static-assets-acl'),

  {
    bucket: bucket.id,
    acl: 'public-read'
  },
  { provider: scalewayProvider }
);

export const APP_STATIC_ENDPOINT = bucket.endpoint;
