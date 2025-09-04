import { Provider } from '@pulumiverse/scaleway';
import { env } from '../env';

export const scalewayProvider = new Provider('scaleway', {
  accessKey: env.SCW_ACCESS_KEY,
  secretKey: env.SCW_SECRET_KEY,
  projectId: env.SCW_DEFAULT_PROJECT_ID
});
