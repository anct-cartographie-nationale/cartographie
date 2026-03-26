import { withLegacyDepartement, withLegacyRegion } from '@/features/cartographie';
import { pageBuilder } from '@/libraries/nextjs/page';

export default pageBuilder()
  .use(withLegacyRegion())
  .use(withLegacyDepartement())
  .redirectTo(({ region, departement }) => `/${region.slug}/${departement.slug}`);
