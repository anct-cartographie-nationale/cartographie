import { pageBuilder } from '@/configuration/nextjs';
import { withLegacyDepartement, withLegacyId, withLegacyRegion } from '@/features/cartographie';

export default pageBuilder()
  .use(withLegacyRegion())
  .use(withLegacyDepartement())
  .use(withLegacyId())
  .redirectTo(({ region, departement, id }) => `/${region.slug}/${departement.slug}/lieux/${id}`);
