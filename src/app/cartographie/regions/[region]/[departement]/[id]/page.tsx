import { withLegacyDepartement, withLegacyId, withLegacyRegion } from '@/features/cartographie';
import { pageBuilder } from '@/libraries/nextjs/page';

export default pageBuilder()
  .use(withLegacyRegion())
  .use(withLegacyDepartement())
  .use(withLegacyId())
  .redirectTo(({ region, departement, id }) => `/${region.slug}/${departement.slug}/lieux/${id}`);
