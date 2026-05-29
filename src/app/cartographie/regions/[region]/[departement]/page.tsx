import { pageBuilder } from '@/configuration/nextjs';
import { withLegacyDepartement, withLegacyRegion } from '@/features/cartographie';

export default pageBuilder()
  .use(withLegacyRegion())
  .use(withLegacyDepartement())
  .redirectTo(({ region, departement }) => `/${region.slug}/${departement.slug}`);
