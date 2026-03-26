import { withLegacyDepartementOnly } from '@/features/cartographie';
import { pageBuilder } from '@/libraries/nextjs/page';

export default pageBuilder()
  .use(withLegacyDepartementOnly())
  .redirectTo(({ region, departement }) => `/${region.slug}/${departement.slug}`);
