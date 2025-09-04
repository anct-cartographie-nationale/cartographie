import { object } from '@pulumiverse/scaleway';
import { config } from '../config';
import { scalewayProvider } from './scaleway.provider';

const bucket = new object.Bucket(
  `${config.projectSlug}-static-bucket`,
  {
    tags: Object.fromEntries(config.tags.map((tag) => [tag, tag])),
    name: `${config.projectSlug}-static`,
    region: 'fr-par'
  },
  { provider: scalewayProvider }
);

new object.BucketAcl(
  `${config.projectSlug}-static-bucket-acl`,
  {
    bucket: bucket.id,
    acl: 'public-read'
  },
  { provider: scalewayProvider }
);

export const APP_STATIC_ENDPOINT = bucket.endpoint;
