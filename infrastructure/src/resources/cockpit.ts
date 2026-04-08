import { local } from '@pulumi/command';
import { env } from '../env';
import { name } from '../utils/name';
import { APP_URL } from './container';

export const grafanaSyncDataSources = new local.Command(name('grafana-sync-data-sources'), {
  create: `curl -s -X POST \
      -H "X-Auth-Token: ${env.SCW_SECRET_KEY}" \
      -H "Content-Type: application/json" \
      -d '{"project_id":"${env.SCW_DEFAULT_PROJECT_ID}"}' \
      "https://api.scaleway.com/cockpit/v1/grafana/sync-data-sources"`,
  triggers: [APP_URL]
});
